import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

type PossibleValue = string | number | boolean | string[] | undefined;

interface OnboardingPayload {
  profileUpdates?: Record<string, PossibleValue>;
  testAnswers?:    Record<string, PossibleValue>;
}

// Helper function to get the base URL for API calls
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Fallback for local development if NEXT_PUBLIC_APP_URL is not set
  return 'http://localhost:3000'; 
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (_error) {
            // Ignore in server component context
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (_error) {
            // Ignore in server component context
          }
        },
      },
    }
  );

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = session.user.id;

  const { profileUpdates, testAnswers }: OnboardingPayload = await request.json();

  if (profileUpdates && Object.keys(profileUpdates).length > 0) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ ...profileUpdates, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (profileError) {
      console.error('Error updating user_profiles:', profileError);
      return NextResponse.json({ error: `Error updating profile: ${profileError.message}` }, { status: 500 });
    }
  }

  let savedTestData = null;
  let aiAnalysisText = null; // Para el texto del análisis
  let aiEmbeddingVector = null; // Para el vector de embedding

  if (testAnswers && Object.keys(testAnswers).length > 0) {
    const { data: upsertData, error: testError } = await supabase
      .from('entrepreneurial_tests')
      .upsert({ ...testAnswers, user_id: userId }, { onConflict: 'user_id' })
      .select()
      .single();

    if (testError) {
      console.error('Error upserting entrepreneurial_tests:', testError);
      return NextResponse.json({ error: `Error saving test answers: ${testError.message}` }, { status: 500 });
    }
    savedTestData = upsertData;

    if (savedTestData && testAnswers && Object.keys(testAnswers).length >= 5) {
      const qaPairsForAI = Object.entries(testAnswers)
        .slice(0, 5)
        .map(([pregunta, respuesta]) => ({ pregunta, respuesta: String(respuesta) }));

      let userCvUrl = profileUpdates?.cv_url as string | undefined || null;
      let userLinkedinUrl = profileUpdates?.linkedin_url as string | undefined || null;

      if (!userCvUrl || !userLinkedinUrl) {
        const { data: currentProfile, error: currentProfileError } = await supabase
          .from('user_profiles')
          .select('cv_url, linkedin_url')
          .eq('id', userId)
          .single();
        
        if (currentProfileError) {
          console.warn('Could not fetch current profile to get CV/LinkedIn URLs:', currentProfileError.message);
        } else if (currentProfile) {
          userCvUrl = userCvUrl || currentProfile.cv_url as string | undefined || null;
          userLinkedinUrl = userLinkedinUrl || currentProfile.linkedin_url as string | undefined || null;
        }
      }

      if (qaPairsForAI.length === 5) {
        try {
          let baseUrl = getBaseUrl();
          // Asegurar que no haya un slash al final de baseUrl antes de concatenar
          if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
          }
          const aiApiUrl = `${baseUrl}/api/analisis-ia/evaluar`;
          const payloadToAI = {
            preguntasRespuestas: qaPairsForAI,
            cvUrl: userCvUrl,
            linkedinUrl: userLinkedinUrl,
          };
          console.log(`Calling AI API: ${aiApiUrl} with payload:`, payloadToAI);
          const aiResponse = await fetch(aiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadToAI),
          });

          const responseText = await aiResponse.text(); // Get response as text first
          console.log('Raw AI API Response Text:', responseText); // Log the raw text

          let aiData;
          try {
            aiData = JSON.parse(responseText); // Try to parse the logged text
          } catch (parseError) {
            console.error('Error parsing AI API response text as JSON:', parseError);
            // Propagate or handle the error that aiData will be undefined
            // This helps in identifying if the response was not JSON
            // You might want to throw new Error or set aiData to a specific error indicator
          }
          
          console.log('AI API Response (parsed):', aiData);

          if (!aiResponse.ok) {
            console.error('Error from AI evaluation API (status ${aiResponse.status}):', aiData ? aiData.error : 'Response was not valid JSON or aiData is undefined');
          } else if (savedTestData.id && aiData) { // Check if aiData is defined
            const updatePayload: { updated_at: string; ai_analysis?: string; ai_analysis_embedding?: number[] } = {
              updated_at: new Date().toISOString(),
            };

            if (aiData.analisis) {
              aiAnalysisText = aiData.analisis;
              updatePayload.ai_analysis = aiData.analisis;
            }
            if (aiData.embedding) {
              aiEmbeddingVector = aiData.embedding;
              updatePayload.ai_analysis_embedding = aiData.embedding;
            }

            if (updatePayload.ai_analysis || updatePayload.ai_analysis_embedding) {
              const { error: updateError } = await supabase
                .from('entrepreneurial_tests')
                .update(updatePayload)
                .eq('id', savedTestData.id);

              if (updateError) {
                console.error('Error saving AI analysis/embedding to DB:', updateError);
              }
            }
          }
        } catch (fetchError) {
          console.error('Error calling AI evaluation API:', fetchError);
        }
      } else if (savedTestData && testAnswers) {
        console.log(`AI evaluation skipped: not enough test answers provided (received ${Object.keys(testAnswers).length}, require 5).`);
      }
    }
  }

  if (savedTestData) {
    const { error: completeError } = await supabase
      .from('user_profiles')
      .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (completeError) {
      console.error('Error marking onboarding complete:', completeError);
      return NextResponse.json({ error: `Error marking onboarding as complete: ${completeError.message}` }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    testData: savedTestData,
    aiAnalysis: aiAnalysisText, 
    aiEmbedding: aiEmbeddingVector 
  }, { status: 200 });
}
