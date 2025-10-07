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

  const ticketDataList = loadTicketData();

  // 管理者用にexpiryTimeを除く
  const listForAdmin = ticketDataList.map(({ expiryTime, ...rest }) => rest);

  res.status(200).json(listForAdmin);
}
