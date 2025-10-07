export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const tickets = global.tickets || [];
  const simplified = tickets.map(({ expiryTime, ...rest }) => rest);
  res.status(200).json(simplified);
}
