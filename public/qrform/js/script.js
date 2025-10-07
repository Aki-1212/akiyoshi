document.getElementById('ticket-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const adults = parseInt(document.getElementById('adults').value, 10);
  const children = parseInt(document.getElementById('children').value, 10);
  const seatPreference = document.querySelector('input[name="seatPreference"]:checked').value;

  fetch('/issueTicket', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, adults, children, seatPreference })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      alert(data.error);
    } else {
      // チケットページにリダイレクト
      window.location.href = `/ticket.html?ticketNumber=${data.ticketNumber}&name=${encodeURIComponent(data.name)}`;
    }
  })
  .catch(() => {
    alert('整理券の発行に失敗しました');
  });
});
