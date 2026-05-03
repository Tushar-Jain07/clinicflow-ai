// Stubbed WhatsApp send — swap for AiSensy/Interakt/Meta Cloud API in production.
export async function sendWhatsApp(to, text) {
  if (!process.env.WHATSAPP_BSP_URL) {
    console.log(`[WA-STUB] -> ${to}: ${text}`);
    return { ok: true, stub: true };
  }
  const r = await fetch(process.env.WHATSAPP_BSP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WHATSAPP_BSP_TOKEN}`,
    },
    body: JSON.stringify({ to, text }),
  });
  return r.json();
}
