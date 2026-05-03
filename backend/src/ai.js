import OpenAI from 'openai';

const SYSTEM = `You are the AI receptionist for ${process.env.CLINIC_NAME || 'a clinic'} in India.
Be warm, concise (max 3 short sentences), and reply in the same language the patient writes (English/Hindi/Hinglish).
Always end with a clear next step: either ask one qualifying question OR share the booking link: ${process.env.CLINIC_BOOKING_URL}.
Never give medical diagnosis. For clinical questions, say a doctor will confirm during the visit.
If the patient asks for price, give a polite range and offer to book a consult.`;

export async function aiReply(message, context = {}) {
  if (!process.env.OPENAI_API_KEY) {
    return `Hi${context.name ? ' ' + context.name : ''}! Thanks for reaching out to ${process.env.CLINIC_NAME}. A team member will confirm shortly. Meanwhile, you can book here: ${process.env.CLINIC_BOOKING_URL}`;
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: message },
    ],
    temperature: 0.4,
    max_tokens: 180,
  });
  return res.choices[0].message.content.trim();
}
