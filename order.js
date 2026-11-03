// المتغيرات تتضاف في Vercel: BOT_TOKEN و CHAT_ID
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('no');
  const d = req.body || {};
  if (d.website) return res.status(200).send('ok'); // honeypot
  const clean = s => String(s || '').replace(/[<>&]/g, '').slice(0, 300);
  if (!/^05\d{8}$/.test(String(d.phone))) return res.status(400).send('phone');
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
  res.status(r.ok ? 200 : 502).send(r.ok ? 'ok' : 'tg');
};
