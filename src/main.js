import './style.css'

// funzioni onclick

window.toggleFaq = function (btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-answer').classList.remove('open');
  });
  if (!isOpen) {
    item.classList.add('open');
    answer.classList.add('open');
  }
};

window.setPhoto = function (src) {
  document.getElementById('main-photo').src = src;
};



// inizializzazione per pagina
function initApp() {

  if (document.getElementById('leaderboardBody')) {
    initClassifica();
    return;
  }

  if (document.getElementById('confirmBox')) {
    initPrenotazione();
    return;
  }

  initIndexForm();
}

// Form in index.html
function initIndexForm() {
  const roomSelect = document.getElementById('roomSelect');
  const playerCount = document.getElementById('playerCount');
  const totalPriceEl = document.getElementById('totalPrice');

  function calculatePrice() {
    if (!roomSelect || !totalPriceEl) return;
    const opt = roomSelect.options[roomSelect.selectedIndex] || { value: '', getAttribute: () => '0' };
    if (!opt.value) { totalPriceEl.innerText = '€0.00'; return; }
    const base = parseFloat(opt.getAttribute('data-price')) || 0;
    const players = parseInt(playerCount?.value) || 0;
    let total = base * players;
    if (players >= 4) total *= 0.8;
    totalPriceEl.innerText = `€${total.toFixed(2)}`;
  }

  if (roomSelect) roomSelect.addEventListener('change', calculatePrice);
  if (playerCount) playerCount.addEventListener('input', calculatePrice);

  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Prenotazione confermata! Ti aspettiamo nel buio...');
      e.target.reset();
      calculatePrice();
    });
  }

  calculatePrice();
}

// Form in prenotazione.html
function initPrenotazione() {
  const stanzaParam = new URLSearchParams(window.location.search).get('stanza');
  if (stanzaParam) {
    const sel = document.getElementById('roomSelect');
    for (const opt of sel.options) {
      if (opt.value === stanzaParam) { opt.selected = true; break; }
    }
  }

  function calculatePrice() {
    const sel = document.getElementById('roomSelect');
    const players = parseInt(document.getElementById('playerCount').value) || 0;
    const opt = sel.options[sel.selectedIndex];
    const base = opt && opt.dataset.price ? parseFloat(opt.dataset.price) : 0;
    let total = base * players;
    const discount = players >= 4;
    if (discount) total *= 0.8;
    document.getElementById('totalPrice').textContent = `€${total.toFixed(2)}`;
    document.getElementById('discountNote').classList.toggle('hidden', !discount || total === 0);
  }

  document.getElementById('roomSelect').addEventListener('change', calculatePrice);
  document.getElementById('playerCount').addEventListener('input', calculatePrice);
  calculatePrice();

  document.getElementById('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('fullName').value;
    const sel = document.getElementById('roomSelect');
    const room = sel.options[sel.selectedIndex].text.split('—')[0].trim();
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('timeSlot').value;
    const players = document.getElementById('playerCount').value;
    const total = document.getElementById('totalPrice').textContent;

    document.getElementById('confirmText').textContent =
      `${name}, la tua prenotazione per "${room}" il ${date} alle ${time} (${players} giocatori) è confermata. Totale: ${total}. Ti aspettiamo nel buio!`;
    document.getElementById('bookingForm').classList.add('hidden');
    document.getElementById('confirmBox').classList.remove('hidden');
  });
}

// Classifica in classifica.html
function initClassifica() {
  let leaderboard = JSON.parse(localStorage.getItem('secretRoomLeaderboard')) || [
    { team: 'Gli Spettri', room: 'Il Clown', time: 38, date: '2026-04-12' },
    { team: 'Cervelloni', room: 'Il Signore Oscuro', time: 52, date: '2026-04-20' },
    { team: 'Team Buio', room: 'The Nun', time: 41, date: '2026-05-01' },
    { team: 'I Coraggiosi', room: 'Il Clown', time: 45, date: '2026-05-10' },
    { team: 'Notte Fonda', room: 'Il Signore Oscuro', time: 58, date: '2026-05-15' },
    { team: 'Le Ombre', room: 'The Nun', time: 33, date: '2026-05-18' },
  ];

  function saveLeaderboard() {
    localStorage.setItem('secretRoomLeaderboard', JSON.stringify(leaderboard));
  }

  function renderLeaderboard() {
    const filter = document.getElementById('filterRoom').value;
    const filtered = (filter === 'all' ? leaderboard : leaderboard.filter(e => e.room === filter))
      .slice().sort((a, b) => a.time - b.time);

    const tbody = document.getElementById('leaderboardBody');
    const empty = document.getElementById('emptyMsg');

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    tbody.innerHTML = filtered.map((entry, i) => {
      const rankClass = i === 0 ? 'rank-gold' : i === 1 ? 'rank-silver' : i === 2 ? 'rank-bronze' : 'text-gray-400';
      const icon = `#${i + 1}`;
      return `
        <tr class="transition border-b border-gray-800 hover:bg-gray-800/50">
          <td class="p-3 font-bold ${rankClass}">${icon}</td>
          <td class="p-3 font-bold text-white">${entry.team}</td>
          <td class="p-3 text-sm text-gray-400">${entry.room}</td>
          <td class="p-3 font-mono font-bold text-white">${entry.time} min</td>
          <td class="p-3 text-xs text-gray-500">${entry.date || '—'}</td>
        </tr>
      `;
    }).join('');
  }

  window.renderLeaderboard = renderLeaderboard;

  document.getElementById('scoreForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const team = document.getElementById('teamName').value.trim();
    const room = document.getElementById('scoreRoom').value;
    const time = parseInt(document.getElementById('teamTime').value);
    const date = document.getElementById('sessionDate').value || new Date().toISOString().split('T')[0];
    leaderboard.push({ team, room, time, date });
    saveLeaderboard();
    e.target.reset();
    renderLeaderboard();
  });

  renderLeaderboard();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
