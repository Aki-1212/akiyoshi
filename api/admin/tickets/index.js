import supabase from '../../../lib/supabaseClient.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { data, error } = await supabase
    .from('tickets')
    .select('ticket_number, name, adults, children, seat_preference, expiry_time')
    .order('ticket_number', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json(data)
}
