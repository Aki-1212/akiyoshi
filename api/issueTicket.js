import supabase from '../lib/supabaseClient.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, adults, children, seatPreference } = req.body
  if (!name || adults == null || children == null || !seatPreference) {
    return res.status(400).json({ error: '全項目が必須です' })
  }

  // 現在の整理券数をチェック
  const { data: existing, error: fetchError } = await supabase
    .from('tickets')
    .select('*')

  if (fetchError) return res.status(500).json({ error: fetchError.message })
  if (existing.length >= 3)
    return res.status(400).json({ error: '整理券の上限に達しています' })

  const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('tickets')
    .insert([
      { name, adults, children, seat_preference: seatPreference, expiry_time: expiryTime }
    ])
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json(data[0])
}
