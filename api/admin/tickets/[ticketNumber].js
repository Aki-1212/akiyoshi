import supabase from '../../../../lib/supabaseClient.js'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end()

  const { ticketNumber } = req.query

  const { error } = await supabase
    .from('tickets')
    .delete()
    .eq('ticket_number', ticketNumber)

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ message: '削除しました' })
}
