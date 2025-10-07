export default function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const { ticketNumber } = req.query;
  let tickets = global.tickets || [];

  const beforeCount = tickets.length;
  tickets = tickets.filter(t => t.ticketNumber != ticketNumber);
  global.tickets = tickets;

  if (tickets.length === beforeCount) {
    return res.status(404).json({ error: '該当する整理券が見つかりません。' });
  }

  res.status(200).json({ message: '整理券を削除しました。' });
}
