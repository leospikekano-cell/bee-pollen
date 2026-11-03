// المتغيرات تتضاف في Netlify: BOT_TOKEN و CHAT_ID
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'no' };
  let d;
  try { d = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, body: 'bad' }; }
  if (d.website) return { statusCode: 200, body: 'ok' }; // honeypot
  const clean = s => String(s || '').replace(/[<>&]/g, '').slice(0, 300);
  if (!/^05\d{8}$/.test(String(d.phone))) return { statusCode: 400, body: 'phone' };
  const pk = d.pkg === '2' ? 'عبوتين' : 'عبوة واحدة';
  const total = d.pkg === '2' ? 270 : 180;
  const text =
`🛒 <b>طلب جديد</b>
👤 الاسم: ${clean(d.name)}
📱 الجوال: ${clean(d.phone)}
🏙️ المدينة: ${clean(d.city)}
📍 العنوان: ${clean(d.address)}
📦 الباقة: ${pk}
💵 الإجمالي: ${total} ريال (عند الاستلام)
✅ واتساب: https://wa.me/966${clean(d.phone).slice(1)}`;
  const r = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.CHAT_ID, text, parse_mode: 'HTML' })
  });
  return { statusCode: r.ok ? 200 : 502, body: r.ok ? 'ok' : 'tg' };
};
