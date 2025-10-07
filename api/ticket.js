export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { ticketNumber, name } = req.query;
  const tickets = global.tickets || [];

  const ticket = tickets.find(
    t => t.ticketNumber == ticketNumber && t.name === name
  );

  if (!ticket) {
    return res.status(404).json({ error: '該当する整理券が見つかりません。' });
  }

  res.status(200).json(ticket);
}
