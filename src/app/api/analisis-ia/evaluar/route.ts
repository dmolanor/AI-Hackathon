// src/app/api/analisis-ia/evaluar/route.ts
import { NextResponse } from 'next/server';
import { APIError, OpenAI } from 'openai';

const EMBEDDING_MODEL = 'text-embedding-ada-002'; // O el modelo de embedding que prefieras

// Interface para el par pregunta-respuesta
interface PreguntaRespuesta {
  pregunta: string;
  respuesta: string;
}

// Interfaz para la estructura esperada de errores HTTP con detalles anidados
interface HttpErrorDetail {
  message: string;
}
interface HttpErrorResponseData {
  error?: HttpErrorDetail;
}
interface HttpErrorWithResponse {
  response?: {
    data?: HttpErrorResponseData;
  };
}

export async function POST(request: Request) {
  // Verificar la variable de entorno ANTES de inicializar el cliente
  if (!process.env.OPENAI_API_KEY) {
    console.error('[IA EVAL API] OPENAI_API_KEY no está configurada.');
    return NextResponse.json({ error: 'Configuración de API de IA incorrecta en el servidor.' }, { status: 500 });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
  }

  try {
    const body = await request.json();
    // Esperar 'preguntasRespuestas', 'cvUrl', y 'linkedinUrl'
    const { preguntasRespuestas, cvUrl, linkedinUrl } = body as {
      preguntasRespuestas?: PreguntaRespuesta[];
      cvUrl?: string | null;
      linkedinUrl?: string | null;
    };

    // Validación actualizada para esperar exactamente 5 pares de pregunta-respuesta
    if (!preguntasRespuestas || !Array.isArray(preguntasRespuestas) || preguntasRespuestas.length !== 5) {
      return NextResponse.json({ error: 'Se requieren exactamente 5 pares de pregunta-respuesta válidos' }, { status: 400 });
    }

    // Validación adicional para cada item en el array
    for (const item of preguntasRespuestas) {
      if (!item || typeof item !== 'object' || 
          !item.pregunta || typeof item.pregunta !== 'string' || item.pregunta.trim() === '' || 
          !item.respuesta || typeof item.respuesta !== 'string') {
        return NextResponse.json({ error: 'Cada par debe ser un objeto con "pregunta" (string no vacío) y "respuesta" (string) válidas.' }, { status: 400 });
      }
    }

    // Paso 1: Generar el análisis textual con el nuevo prompt
    let promptContext = `
Eres un experto en psicometría aplicada al emprendimiento. Genera un análisis de máximo 500 caracteres del siguiente conjunto de preguntas y respuestas del usuario y evalúa su perfil emprendedor.
Preguntas y Respuestas del usuario:
${preguntasRespuestas.map((pr, i) => `Pregunta ${i + 1}: ${pr.pregunta}\nRespuesta ${i + 1}: ${pr.respuesta}`).join('\n\n')}
`;

    if (cvUrl) {
      promptContext += `\n\nEl usuario ha proporcionado un CV en la siguiente URL: ${cvUrl}`;
    }
    if (linkedinUrl) {
      promptContext += `\nEl usuario ha proporcionado un perfil de LinkedIn en la siguiente URL: ${linkedinUrl}`;
    }

    promptContext += `\n\nAnálisis del Perfil Emprendedor (máximo 500 caracteres):`;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4', // O el modelo que estés usando para el análisis
      messages: [{ role: 'user', content: promptContext }],
      temperature: 0.75,
      max_tokens: 150 // Ajustado para ~500 caracteres, considera tokens vs caracteres
    });

    const analysisContent = chatCompletion.choices[0].message.content?.trim() || '';

    if (!analysisContent) {
      return NextResponse.json({ error: 'No se pudo generar el contenido del análisis' }, { status: 500 });
    }

    // Paso 2: Generar embeddings para el análisis textual
    let embeddingVector = null;
    try {
      const embeddingResponse = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: analysisContent,
      });
      embeddingVector = embeddingResponse.data[0]?.embedding;
      if (!embeddingVector) {
        console.warn('[IA EVAL API] No se pudo generar el embedding, pero el análisis textual se completó.');
      }
    } catch (embeddingError: unknown) {
      console.error('[IA EVAL API] Error al generar embeddings:', embeddingError);
    }
    
    return NextResponse.json({
      analisis: analysisContent,
      embedding: embeddingVector // Podría ser null si la generación de embedding falló
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('[IA EVAL API] Error en el proceso de evaluación IA:', error);
    let errorMessage = 'Error interno en el proceso de evaluación IA';
    let statusCode = 500;

    if (error instanceof APIError) {
      errorMessage = error.message;
      statusCode = error.status || 500;
      console.error('[IA EVAL API] OpenAI APIError Details:', { 
        name: error.name, 
        status: error.status, 
        message: error.message, 
        headers: error.headers, 
        error: error.error
      });
    } else if (error instanceof Error) {
      errorMessage = error.message;
      // Intenta verificar si es un error con una estructura similar a los de una API HTTP
      const unknownError = error as Error & HttpErrorWithResponse;
      if (unknownError.response?.data?.error?.message) {
        errorMessage = `${error.message} (Detalle: ${unknownError.response.data.error.message})`;
      } else if ((error as any).cause) { // Mantener 'as any' para 'cause' si no es estándar
         errorMessage = `${error.message} (Causa: ${(error as any).cause})`;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    console.log(`[IA EVAL API] Respondiendo con error JSON: status ${statusCode}, message: ${errorMessage}`);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
