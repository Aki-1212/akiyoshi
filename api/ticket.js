import fs from 'fs';
import path from 'path';

const ticketFilePath = path.join(process.cwd(), 'ticketData.json');

function loadTicketData() {
  if (fs.existsSync(ticketFilePath)) {
    const data = fs.readFileSync(ticketFilePath, 'utf8');
    if (!data) return [];
    return JSON.parse(data);
  }
  return [];
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'GETメソッドのみ許可されています' });
    return;
  }

  const { ticketNumber, name } = req.query;

  if (!ticketNumber || !name) {
    res.status(400).json({ error: 'ticketNumberとnameは必須です' });
    return;
  }

  const ticketDataList = loadTicketData();
  const ticket = ticketDataList.find(
    t => t.ticketNumber === parseInt(ticketNumber) && t.name === name
  );

  if (!ticket) {
    res.status(404).json({ error: '該当する整理券が見つかりません' });
    return;
  }

  res.status(200).json(ticket);
}
