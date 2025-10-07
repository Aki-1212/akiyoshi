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

function saveTicketData(ticketDataList) {
  fs.writeFileSync(ticketFilePath, JSON.stringify(ticketDataList, null, 2), 'utf8');
}

export default function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.status(405).json({ error: 'DELETEメソッドのみ許可されています' });
    return;
  }

  const { ticketNumber } = req.query;

  let ticketDataList = loadTicketData();

  const beforeCount = ticketDataList.length;
  ticketDataList = ticketDataList.filter(ticket => ticket.ticketNumber !== parseInt(ticketNumber));

  if (ticketDataList.length === beforeCount) {
    res.status(404).json({ error: '該当する整理券が見つかりません' });
    return;
  }

  saveTicketData(ticketDataList);

  res.status(200).json({ message: '整理券が削除されました' });
}
