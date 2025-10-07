let tickets = global.tickets || [];
global.tickets = tickets;
let ticketCounter = global.ticketCounter || 1;
global.ticketCounter = ticketCounter;

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, adults, children, seatPreference } = req.body;
  if (!name || adults == null || children == null || !seatPreference) {
    return res.status(400).json({ error: '全項目が必須です' });
  }

  if (tickets.length >= 3) {
    return res.status(400).json({ error: '整理券の上限に達しています' });
  }

  const ticket = {
    ticketNumber: ticketCounter++,
    name,
    adults,
    children,
    seatPreference,
    expiryTime: new Date(Date.now() + 1000 * 60 * 60).toISOString()
  };

  tickets.push(ticket);
  global.ticketCounter = ticketCounter;
  return res.status(200).json(ticket);
}
