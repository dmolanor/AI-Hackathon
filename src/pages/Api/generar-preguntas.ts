import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { respuestas } = req.body;

  if (!respuestas || !Array.isArray(respuestas) || respuestas.length !== 5) {
    return res.status(400).json({ error: 'Se requieren 5 respuestas válidas' });
  }

  const prompt = `
Eres un experto en psicometría aplicada al emprendimiento. A partir de las siguientes 5 respuestas del usuario, genera 5 preguntas adicionales que profundicen su perfil emprendedor. Las preguntas deben ser claras, abiertas y desafiantes.

Respuestas del usuario:
${respuestas.map((r, i) => `Respuesta ${i + 1}: ${r}`).join('\n')}

Devuelve solo las preguntas en una lista numerada del 1 al 5.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.75,
      max_tokens: 500
    });

    const content = completion.choices[0].message.content || '';
    const preguntas = content.split('\n').filter(p => p.trim() !== '');

    res.status(200).json({ preguntas });
  } catch (error) {
    console.error('Error al generar preguntas:', error);
    res.status(500).json({ error: 'Error interno al generar preguntas' });
  }
}
