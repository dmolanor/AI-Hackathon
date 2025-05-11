import { NextResponse } from 'next/server';
import { APIError, OpenAI } from 'openai';

// Interfaz para la estructura esperada de errores HTTP con detalles anidados
// (Puedes definirla aquí o importarla si la tienes en un archivo de tipos común)
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
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  if (!process.env.OPENAI_API_KEY) {
    console.error('[IA GEN PREG API] OPENAI_API_KEY no está configurada.');
    return NextResponse.json({ error: 'Configuración de API incorrecta.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { respuestas } = body;

    if (!respuestas || !Array.isArray(respuestas) || respuestas.length !== 5) {
      return NextResponse.json({ error: 'Se requieren 5 respuestas válidas' }, { status: 400 });
    }

    const prompt = `
Eres un experto en psicometría aplicada al emprendimiento. A partir de las siguientes 5 respuestas del usuario, genera 5 preguntas adicionales que profundicen su perfil emprendedor. Las preguntas deben ser claras, abiertas y desafiantes.

Respuestas del usuario:
${respuestas.map((r, i) => `Respuesta ${i + 1}: ${r}`).join('\n')}

Devuelve solo las preguntas en una lista numerada del 1 al 5.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.75,
      max_tokens: 500
    });

    const content = completion.choices[0].message.content || '';
    const preguntas = content.split('\n').filter(p => p.trim() !== '' && !p.match(/^\d+\.\s*/));
    // Si OpenAI ya devuelve una lista numerada, el filter anterior podría ser demasiado agresivo.
    // Podríamos simplemente limpiar el número y el punto: .map(p => p.replace(/^\d+\.\s*/, '').trim())
    // O si el formato es consistente como "1. Pregunta", entonces el split y filter es razonable.
    // Considerar si el prompt a OpenAI puede pedir un formato JSON de salida para evitar el parseo de texto.

    return NextResponse.json({ preguntas }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error al generar preguntas:', error);
    let errorMessage = 'Error interno al generar preguntas';
    let statusCode = 500;

    if (error instanceof APIError) {
      errorMessage = error.message;
      statusCode = error.status || 500;
      console.error('[IA GEN PREG API] OpenAI APIError Details:', {
        name: error.name,
        status: error.status,
        message: error.message,
        headers: error.headers,
        error: error.error
      });
    } else if (error instanceof Error) {
      errorMessage = error.message;
      const unknownError = error as Error & HttpErrorWithResponse;
      if (unknownError.response?.data?.error?.message) {
        errorMessage = `${error.message} (Detalle: ${unknownError.response.data.error.message})`;
      } else if ((error as any).cause) {
        errorMessage = `${error.message} (Causa: ${(error as any).cause})`;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    console.log(`[IA GEN PREG API] Respondiendo con error JSON: status ${statusCode}, message: ${errorMessage}`);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
