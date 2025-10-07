const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const ticketFilePath = path.join(__dirname, '../ticketData.json');

const maxTickets = 3;

// publicディレクトリを静的ファイルとして提供
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// --- 整理券データの読み込み ---
function loadTicketData() {
  if (fs.existsSync(ticketFilePath)) {
    const data = fs.readFileSync(ticketFilePath, 'utf8');
    if (!data) return [];

    let ticketData = JSON.parse(data);

    const now = new Date();

    // 有効期限切れの整理券は除外
    const validTickets = ticketData.filter(ticket => {
      const ticketExpiry = new Date(ticket.expiryTime);
      return ticketExpiry > now;
    });

    // 期限切れ整理券があれば上書き保存
    if (validTickets.length !== ticketData.length) {
      saveTicketData(validTickets);
    }

    return validTickets;
  }
  return [];
}

// --- 整理券データの保存 ---
function saveTicketData(ticketDataList) {
  fs.writeFileSync(ticketFilePath, JSON.stringify(ticketDataList, null, 2), 'utf8');
}

// --- 整理券番号カウンター初期化 ---
function initTicketCounter() {
  const ticketDataList = loadTicketData();
  if (ticketDataList.length === 0) return 1;
  return Math.max(...ticketDataList.map(t => t.ticketNumber)) + 1;
}

let ticketCounter = initTicketCounter();

// --- 整理券発行 ---
app.post('/issueTicket', (req, res) => {
  const { name, adults, children, seatPreference } = req.body;

  if (!name || adults == null || children == null || !seatPreference) {
    return res.status(400).json({ error: 'すべての項目は必須です。' });
  }

  let ticketDataList = loadTicketData();

  if (ticketDataList.length >= maxTickets) {
    return res.status(400).json({ error: 'これ以上整理券は発行できません。' });
  }

  const ticketNumber = ticketCounter++;

  const now = new Date();
  let expiryTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 15, 0);

  // もし現在が17:15を過ぎていたら翌日の17:15に設定
  if (now > expiryTime) {
    expiryTime.setDate(expiryTime.getDate() + 1);
  }

  const ticket = {
    ticketNumber,
    name,
    adults,
    children,
    seatPreference,
    expiryTime: expiryTime.toISOString()
  };

  ticketDataList.push(ticket);
  saveTicketData(ticketDataList);

  res.json(ticket);
});

// --- 整理券一覧取得（管理者用） ---
app.get('/admin/tickets', (req, res) => {
  const ticketDataList = loadTicketData();
  // 管理画面ではexpiryTimeは不要なので除去して返す
  const listForAdmin = ticketDataList.map(({ expiryTime, ...rest }) => rest);
  res.json(listForAdmin);
});

// --- 整理券削除（管理者用） ---
app.delete('/admin/tickets/:ticketNumber', (req, res) => {
  const { ticketNumber } = req.params;
  let ticketDataList = loadTicketData();

  const beforeCount = ticketDataList.length;
  ticketDataList = ticketDataList.filter(ticket => ticket.ticketNumber !== parseInt(ticketNumber));
  if (ticketDataList.length === beforeCount) {
    return res.status(404).json({ error: '該当する整理券が見つかりません。' });
  }

  saveTicketData(ticketDataList);

  res.status(200).json({ message: '整理券が削除されました' });
});

// --- 整理券個別取得（ユーザー用） ---
app.get('/ticket', (req, res) => {
  const { ticketNumber, name } = req.query;

  if (!ticketNumber || !name) {
    return res.status(400).json({ error: 'ticketNumberとnameは必須です。' });
  }

  const ticketDataList = loadTicketData();
  const ticket = ticketDataList.find(
    t => t.ticketNumber === parseInt(ticketNumber) && t.name === name
  );

  if (!ticket) {
    return res.status(404).json({ error: '該当する整理券が見つかりません。' });
  }

  res.json(ticket);
});

// --- QRコード用トークンURL（例）---
// もしトークン化URLを導入したければこの辺で発行し対応

// --- サーバー起動 ---
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
