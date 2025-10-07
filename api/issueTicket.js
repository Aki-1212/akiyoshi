import fs from 'fs';
import path from 'path';

const ticketFilePath = path.join(process.cwd(), 'ticketData.json');
const maxTickets = 3;

// 整理券データ読み込み
function loadTicketData() {
  if (fs.existsSync(ticketFilePath)) {
    const data = fs.readFileSync(ticketFilePath, 'utf8');
    if (!data) return [];

    const ticketData = JSON.parse(data);
    const now = new Date();

    // 有効期限切れ整理券を除外
    const validTickets = ticketData.filter(ticket => new Date(ticket.expiryTime) > now);

    if (validTickets.length !== ticketData.length) {
      fs.writeFileSync(ticketFilePath, JSON.stringify(validTickets, null, 2), 'utf8');
    }

    return validTickets;
  }
  return [];
}

// 整理券データ保存
function saveTicketData(ticketDataList) {
  fs.writeFileSync(ticketFilePath, JSON.stringify(ticketDataList, null, 2), 'utf8');
}

// 整理券番号カウンター（メモリ内簡易版）
let ticketCounter = (() => {
  const tickets = loadTicketData();
  if (tickets.length === 0) return 1;
  return Math.max(...tickets.map(t => t.ticketNumber)) + 1;
})();

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POSTメソッドのみ許可されています' });
    return;
  }

  const { name, adults, children, seatPreference } = req.body;

  if (!name || adults == null || children == null || !seatPreference) {
    res.status(400).json({ error: 'すべての項目は必須です' });
    return;
  }

  const ticketDataList = loadTicketData();

  if (ticketDataList.length >= maxTickets) {
    res.status(400).json({ error: 'これ以上整理券は発行できません' });
    return;
  }

  const ticketNumber = ticketCounter++;

  const now = new Date();
  let expiryTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 15, 0);
  if (now > expiryTime) expiryTime.setDate(expiryTime.getDate() + 1);

  const ticket = {
    ticketNumber,
    name,
    adults,
    children,
    seatPreference,
    expiryTime: expiryTime.toISOString(),
  };

  ticketDataList.push(ticket);
  saveTicketData(ticketDataList);

  res.status(200).json(ticket);
}
