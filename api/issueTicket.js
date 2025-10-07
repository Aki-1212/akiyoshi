let tickets = global.tickets || [];
let ticketCounter = global.ticketCounter || 1;
const maxTickets = 3;

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, adults, children, seatPreference } = req.body;
  if (!name || adults == null || children == null || !seatPreference) {
    return res.status(400).json({ error: '全項目が必須です。' });
  }

  if (tickets.length >= maxTickets) {
    return res.status(400).json({ error: '整理券の上限に達しています。' });
  }

  const ticket = {
    ticketNumber: ticketCounter++,
    name,
    adults,
    children,
    seatPreference,
    expiryTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1時間後
  };

  tickets.push(ticket);

  // Save back to global
  global.tickets = tickets;
  global.ticketCounter = ticketCounter;

  res.status(200).json(ticket);
}
