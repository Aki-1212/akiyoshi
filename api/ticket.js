import supabase from '../lib/supabaseClient.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { ticketNumber, name } = req.query

  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('ticket_number', ticketNumber)
    .eq('name', name)
    .single()

  if (error || !data) {
    return res.status(404).json({ error: '該当する整理券がありません' })
  }

  res.status(200).json(data)
}
