<!-- =========================================
     JAVASCRIPT
     ========================================= -->

// =============================================
// DATA
// =============================================
const CARDS_DATA = {
  memory: {
    label: 'Memory Lane', icon: '⏳', color: '#ce93d8',
    prompts: [
      "Play a song that reminds you of when we first met. What memory comes to mind?",
      "Choose a song that represents a turning point in our relationship.",
      "What song was playing during one of your happiest moments with me?",
      "Pick a track that brings back a memory you've never told me about.",
      "What song would be the anthem of the year we fell in love?",
    ]
  },
  fantasy: {
    label: 'Fantasy Frequencies', icon: '✨', color: '#f48fb1',
    prompts: [
      "What song would be playing during our spontaneous road trip?",
      "Pick a song that would set the tone for our ideal lazy Sunday morning.",
      "If we starred in a romantic movie, what would the opening credits song be?",
      "DJ a playlist for the most perfect date night you can imagine.",
      "What song plays when we finally take that dream vacation?",
    ]
  },
  vibe: {
    label: 'Vibe Check', icon: '🎯', color: '#80deea',
    prompts: [
      "Choose a song that matches your mood right now — no explanations until they guess.",
      "Play a track that reflects how your love feels today.",
      "Pick the song that's been living rent-free in your head this week.",
      "What song would be the background track of your current headspace?",
      "Choose a song that describes how you feel about our future.",
    ]
  },
  deep: {
    label: 'Deep Cuts', icon: '🖤', color: '#fff176',
    prompts: [
      "What's a song that helped shape who you are? Why?",
      "Pick a song you've never shared with me — but that means something personal.",
      "Choose a track that reflects a part of yourself you wish I understood better.",
      "What song helped you through your hardest moment before we met?",
      "Pick a song that captures your biggest fear. Let's talk about it.",
    ]
  },
  battle: {
    label: 'DJ Battle', icon: '⚡', color: '#ffcc80',
    prompts: [
      "Theme: 'Makeout Mix' — each player picks a song; the other chooses the winner.",
      "Theme: 'Angry Bop' — pick the best song to yell-sing in traffic after a bad day.",
      "Theme: 'Bedroom Energy' — you have 60 seconds. Go.",
      "Theme: 'Apology Mix' — who picks the most genuine sorry song?",
      "Theme: 'Road Trip Opener' — the song that kicks off every adventure.",
    ]
  }
};

const MOODS = {
  romantic:   { emoji: '❤️', songs: ['Perfect — Ed Sheeran', 'All of Me — John Legend', 'Lover — Taylor Swift', 'Golden Hour — JVKE'] },
  nostalgic:  { emoji: '⏳', songs: ['The Night We Met — Lord Huron', 'Skinny Love — Bon Iver', 'Youth — Daughter', 'Holocene — Bon Iver'] },
  playful:    { emoji: '😄', songs: ['Uptown Funk — Bruno Mars', 'Happy — Pharrell Williams', "Can't Stop the Feeling — JT", 'Cheap Thrills — Sia'] },
  vulnerable: { emoji: '🌙', songs: ['Poison & Wine — The Civil Wars', 'Flightless Bird — Fleet Foxes', 'Heavy — Birdtalker', 'Saturn — SZA'] },
};

// =============================================
// STATE
// =============================================
let currentCat   = 'memory';
let cardIndex    = 0;
let sessionLog   = [];
let cartItems    = [];
let playlist     = [];
let vinylSpinning = false;

// =============================================
// NAVIGATION
// =============================================
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const nb = document.getElementById('nav-' + id);
  if (nb) nb.classList.add('active');
  window.scrollTo(0,0);
}

function toggleMobileMenu() {
  const m = document.getElementById('mobile-menu');
  m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
}

// =============================================
// VINYL
// =============================================
function toggleVinyl() {
  vinylSpinning = !vinylSpinning;
  const disc = document.getElementById('vinyl-disc');
  if (vinylSpinning) disc.classList.add('spinning');
  else disc.classList.remove('spinning');
}

// =============================================
// MUSIC NOTES FLOAT
// =============================================
const notes = ['♪','♫','♩','♬','🎵','🎶'];
function spawnNote() {
  const container = document.getElementById('music-notes');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'note';
  el.textContent = notes[Math.floor(Math.random()*notes.length)];
  el.style.left = Math.random()*100 + '%';
  el.style.bottom = (Math.random()*20 + 5) + '%';
  el.style.color = ['#ff5722','#ff9800','#ffd54f','#ff4081','#00bcd4'][Math.floor(Math.random()*5)];
  el.style.fontSize = (Math.random()*16+14) + 'px';
  el.style.animationDuration = (Math.random()*3+3) + 's';
  el.style.animationDelay = '0s';
  container.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}
setInterval(spawnNote, 1200);

// =============================================
// PLAY GAME
// =============================================
function selectCat(cat, btn) {
  currentCat = cat;
  cardIndex  = 0;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderCard();
}

function renderCard() {
  const cat  = CARDS_DATA[currentCat];
  const disp = document.getElementById('game-card-display');
  const tag  = document.getElementById('card-cat-tag');
  const prom = document.getElementById('card-prompt');

  tag.textContent   = `${cat.icon} ${cat.label} — Card ${cardIndex+1} of ${cat.prompts.length}`;
  tag.style.color   = cat.color;
  prom.textContent  = `"${cat.prompts[cardIndex]}"`;
  disp.style.borderColor = cat.color + '70';
  disp.style.background  = `linear-gradient(135deg, ${cat.color}18, var(--card))`;
  disp.style.boxShadow   = `0 0 60px ${cat.color}20`;
  disp.classList.add('card-flip-anim');
  setTimeout(() => disp.classList.remove('card-flip-anim'), 400);
}

function nextCard() {
  const cat = CARDS_DATA[currentCat];
  // Log current card
  sessionLog.push({ cat: currentCat, prompt: cat.prompts[cardIndex] });
  cardIndex = (cardIndex + 1) % cat.prompts.length;
  renderCard();
  updateSessionLog();
}

function resetGame() {
  cardIndex  = 0;
  sessionLog = [];
  renderCard();
  document.getElementById('session-log').style.display = 'none';
}

function updateSessionLog() {
  if (sessionLog.length === 0) return;
  const log = document.getElementById('session-log');
  log.style.display = 'block';
  document.getElementById('log-count').textContent = sessionLog.length;
  const container = document.getElementById('log-items');
  container.innerHTML = sessionLog.slice(-5).reverse().map(item => {
    const cat = CARDS_DATA[item.cat];
    return `<div class="log-item">
      <span class="log-icon">${cat.icon}</span>
      <span class="log-text">"${item.prompt}"</span>
    </div>`;
  }).join('');
}

// =============================================
// SHOP / CART
// =============================================
function addToCart(name, price) {
  cartItems.push({ name, price });
  updateCartBar();
  showToast(`✓ "${name}" added to cart`);
}

function updateCartBar() {
  const bar  = document.getElementById('cart-bar');
  const text = document.getElementById('cart-text');
  if (cartItems.length > 0) {
    bar.classList.add('visible');
    const total = cartItems.reduce((s, i) => s + i.price, 0);
    text.textContent = `🛒 ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} — $${total}`;
  } else {
    bar.classList.remove('visible');
  }
}

// =============================================
// APP — MOOD
// =============================================
function selectMood(mood, btn) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const data = MOODS[mood];
  const sugg = document.getElementById('mood-sugg');
  sugg.style.display = 'block';
  document.getElementById('sugg-label').textContent = `SUGGESTED FOR ${mood.toUpperCase()}`;
  document.getElementById('sugg-songs').innerHTML = data.songs.map(s => `<div class="mood-sugg-song">♪ ${s}</div>`).join('');
}

// =============================================
// APP — PLAYLIST
// =============================================
function addSong() {
  const input = document.getElementById('song-input');
  const val   = input.value.trim();
  if (!val) return;
  playlist.push(val);
  input.value = '';
  renderPlaylist();
}

function removeSong(idx) {
  playlist.splice(idx, 1);
  renderPlaylist();
}

function renderPlaylist() {
  const container = document.getElementById('playlist-songs');
  const empty     = document.getElementById('playlist-empty');
  const exportBtn = document.getElementById('export-btn');
  if (playlist.length === 0) {
    container.innerHTML = '<div class="playlist-empty" id="playlist-empty">No songs yet — start adding! ♪</div>';
    exportBtn.style.display = 'none';
    return;
  }
  exportBtn.style.display = 'block';
  container.innerHTML = playlist.map((s, i) => `
    <div class="song-item">
      <span class="song-name">♪ ${s}</span>
      <button class="btn-rm-song" onclick="removeSong(${i})">✕</button>
    </div>
  `).join('');
}

// =============================================
// TOAST
// =============================================
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.display = 'none'; }, 2800);
}

// =============================================
// INIT
// =============================================
renderCard();

