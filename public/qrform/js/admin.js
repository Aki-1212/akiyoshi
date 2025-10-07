// public/js/admin.js
window.onload = function() {
    // 整理券情報をバックエンドから取得
    fetch('/admin/tickets')
        .then(response => response.json())
        .then(tickets => {
            const ticketTableBody = document.getElementById('ticketTableBody');
            tickets.forEach(ticket => {
                const row = document.createElement('tr');
                
                // expiryTimeがISO 8601形式で返ってくる場合に見やすくフォーマット
                const formattedExpiryTime = new Date(ticket.expiryTime).toLocaleString();

                row.innerHTML = `
                    <td>${ticket.ticketNumber}</td>
                    <td>${ticket.name}</td>
                    <td>${ticket.adults}</td>
                    <td>${ticket.children}</td>
                    <td>${ticket.seatPreference}</td>
                    <td><button class="deleteButton" data-ticket-number="${ticket.ticketNumber}">削除</button></td>
                `;
                ticketTableBody.appendChild(row);
            });

            // 削除ボタンにイベントリスナーを設定
            const deleteButtons = document.querySelectorAll('.deleteButton');
            deleteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const ticketNumber = this.getAttribute('data-ticket-number');
                    deleteTicket(ticketNumber);
                });
            });
        })
        .catch(error => {
            console.error('整理券情報の取得に失敗しました:', error);
        });
};

// 整理券を削除する関数
function deleteTicket(ticketNumber) {
    fetch(`/admin/tickets/${ticketNumber}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('整理券の削除に失敗しました');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        location.reload();  // 削除後、ページをリロードして表示を更新
    })
    .catch(error => {
        alert('整理券の削除に失敗しました');
        console.error(error);
    });
}
