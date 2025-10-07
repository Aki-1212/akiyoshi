export default function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const { ticketNumber } = req.query;
  let tickets = global.tickets || [];

  const before = tickets.length;
  tickets = tickets.filter(t => t.ticketNumber != ticketNumber);
  global.tickets = tickets;

  if (tickets.length === before) {
    return res.status(404).json({ error: '整理券が見つかりません' });
  }

  res.status(200).json({ message: '削除しました' });
}
