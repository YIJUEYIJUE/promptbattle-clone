// ═══════════════════════════════════════
// PromptBattle Clone — App Logic
//   • Gallery (masonry) + infinite scroll
//   • Lightbox (uses static #lightbox in DOM)
//   • SPA view switching (gallery/compete/rankings/about)
//   • Modals: login / register / wechat QR
//   • Theme toggle (dark/light, persisted)
//   • Rankings + submit form (demo)
// ═══════════════════════════════════════

// Current user (updated after demo login)
let currentUser = '匿名创客';

// ── Gallery data (30 works) ──
const GALLERY_DATA = [
  { img: 'assets/gallery/img-001-一种情绪.png', title: '一种情绪', author: '林深' },
  { img: 'assets/gallery/img-002-独自升级.png', title: '独自升级', author: '苏野' },
  { img: 'assets/gallery/img-003-鸟为什么会飞.png', title: '鸟为什么会飞', author: 'Kira' },
  { img: 'assets/gallery/img-004-酸.png', title: '酸', author: '阿潮' },
  { img: 'assets/gallery/img-005-微缩世界.png', title: '微缩世界', author: '老周' },
  { img: 'assets/gallery/img-006-神经质.png', title: '【复活赛】神经质', author: '陈默' },
  { img: 'assets/gallery/img-007-月亮之上.png', title: '月亮之上 / 爱情买卖', author: '小鹿' },
  { img: 'assets/gallery/img-008-生活搭子.webp', title: '生活搭子', author: '阿杰' },
  { img: 'assets/gallery/img-009-英雄之旅.png', title: '英雄之旅', author: '北辰' },
  { img: 'assets/gallery/img-010-时间到.png', title: '时间到', author: '七喜' },
  { img: 'assets/gallery/img-011-否极泰来.png', title: '否极泰来', author: '安然' },
  { img: 'assets/gallery/img-012-右3-4照.png', title: '右3-4照', author: '摄影师老王' },
  { img: 'assets/gallery/img-013-像素.png', title: '像素', author: 'Pixel哥' },
  { img: 'assets/gallery/img-014-失重.png', title: '失重', author: '银河' },
  { img: 'assets/gallery/img-015-图书馆的情侣.png', title: '图书馆的情侣', author: '微光' },
  { img: 'assets/gallery/img-016-连接.png', title: '连接', author: '桥本' },
  { img: 'assets/gallery/img-017-艳阳天.png', title: '艳阳天', author: '晴天' },
  { img: 'assets/gallery/img-018-芳草地.png', title: '芳草地', author: '青禾' },
  { img: 'assets/gallery/img-019-呼吸.png', title: '呼吸', author: '风铃' },
  { img: 'assets/gallery/img-020-牛顿水.png', title: '牛顿水', author: '果果' },
  { img: 'assets/gallery/img-021-柚子buff.png', title: '柚子buff', author: '柚子' },
  { img: 'assets/gallery/img-022-100种颜色.png', title: '100种颜色', author: '调色师' },
  { img: 'assets/gallery/img-023-呼吸2.png', title: '呼吸2', author: '风铃' },
  { img: 'assets/gallery/img-024-风.png', title: '风', author: '山岚' },
  { img: 'assets/gallery/img-025-水墨.png', title: '水墨', author: '墨白' },
  { img: 'assets/gallery/img-026-基因与环境.png', title: '基因与环境', author: '达尔文' },
  { img: 'assets/gallery/img-027-龙卷风.png', title: '龙卷风', author: '风暴' },
  { img: 'assets/gallery/img-028-迟到千年.png', title: '迟到千年', author: '时光' },
  { img: 'assets/gallery/img-029-你将漂流一生.png', title: '你将漂流一生', author: '远舟' },
  { img: 'assets/gallery/img-030-惊叫中的恐惧.png', title: '惊叫中的恐惧', author: '蒙克' }
];

// Deterministic color from a string (for initials avatar)
function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  const hue = Math.abs(h) % 360;
  return `hsl(${hue}, 45%, 55%)`;
}

// ── Gallery render ──
const grid = document.getElementById('masonry-grid');
const loader = document.getElementById('loader');
let renderCount = 0;
const BATCH = 12;

function makeCard(item, index) {
  const card = document.createElement('article');
  card.className = 'gallery-card';
  card.style.animationDelay = `${(index % BATCH) * 0.04}s`;

  const img = document.createElement('img');
  img.className = 'card-img';
  img.src = item.img;
  img.alt = item.title || '';
  img.loading = 'lazy';

  const who = item.author || '匿名';
  const avatar = document.createElement('div');
  avatar.className = 'card-avatar-wrap';
  avatar.style.background = hashColor(who);
  avatar.textContent = who.charAt(0);
  avatar.title = who;

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = item.title || '';

  card.append(img, avatar, title);
  card.addEventListener('click', () => openLightbox(item));
  return card;
}

function appendBatch() {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < BATCH; i++) {
    const item = GALLERY_DATA[renderCount % GALLERY_DATA.length];
    frag.appendChild(makeCard(item, renderCount));
    renderCount++;
  }
  grid.appendChild(frag);
}

// Initial render (2 batches)
appendBatch();
appendBatch();

// Infinite scroll
let loading = false;
const io = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !loading) {
    loading = true;
    loader.classList.add('show');
    setTimeout(() => {
      appendBatch();
      loader.classList.remove('show');
      loading = false;
    }, 350);
  }
}, { rootMargin: '400px' });
io.observe(loader);

// Header scroll shadow
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Lightbox (static DOM: #lightbox) ──
function openLightbox(item) {
  const lb = document.getElementById('lightbox');
  lb.querySelector('.lb-img').src = item.img;
  lb.querySelector('.lb-title').textContent = item.title || '';
  lb.querySelector('.lb-author').textContent = '创作者：' + (item.author || '匿名');
  lb.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(e) {
  const lb = document.getElementById('lightbox');
  if (e.target === lb || e.target.classList.contains('lb-close') || e.target.closest('.lb-close')) {
    lb.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// ── Modal helpers ──
function openModal(id) {
  document.getElementById(id).classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
  document.body.style.overflow = '';
}
function closeOnOverlay(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}
function openLoginModal() { openModal('modal-login'); }
function openRegisterModal() { openModal('modal-register'); }
function openWechatModal() { openModal('modal-wechat'); }

function doLogin() {
  closeModal('modal-login');
  currentUser = '创作者';
  const btn = document.getElementById('btn-login');
  btn.textContent = '创作者';
  btn.onclick = () => showToast('已登录（演示账号）');
  showToast('登录成功（演示）');
}

// ── SPA view switching ──
const VIEW_LABELS = {
  gallery: '作品展示',
  compete: '参赛投稿',
  rankings: '排行榜',
  about: '关于平台'
};
function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
  const target = document.getElementById('view-' + viewId);
  if (target) target.classList.add('active-view');
  const label = document.getElementById('nav-label');
  if (label) label.textContent = VIEW_LABELS[viewId] || '作品展示';
  const hero = document.getElementById('hero');
  if (hero) hero.style.display = (viewId === 'gallery') ? '' : 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Theme toggle (persisted) ──
(function initTheme() {
  const KEY = 'bv-theme';
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) document.body.setAttribute('data-theme', saved);
  } catch (e) {}
  const btn = document.getElementById('btn-theme');
  if (btn) {
    btn.addEventListener('click', () => {
      const cur = document.body.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  }
})();

// ── Rankings data ──
const RANKINGS_DATA = [
  { img: 'assets/gallery/img-006-神经质.png', title: '【复活赛】神经质', author: '陈默', votes: 2480, period: 'week' },
  { img: 'assets/gallery/img-002-独自升级.png', title: '独自升级', author: '苏野', votes: 2310, period: 'month' },
  { img: 'assets/gallery/img-005-微缩世界.png', title: '微缩世界', author: '老周', votes: 1980, period: 'week' },
  { img: 'assets/gallery/img-025-水墨.png', title: '水墨', author: '墨白', votes: 1760, period: 'month' },
  { img: 'assets/gallery/img-027-龙卷风.png', title: '龙卷风', author: '风暴', votes: 1540, period: 'week' },
  { img: 'assets/gallery/img-022-100种颜色.png', title: '100种颜色', author: '调色师', votes: 1390, period: 'month' },
  { img: 'assets/gallery/img-029-你将漂流一生.png', title: '你将漂流一生', author: '远舟', votes: 1230, period: 'week' },
  { img: 'assets/gallery/img-007-月亮之上.png', title: '月亮之上 / 爱情买卖', author: '小鹿', votes: 1100, period: 'month' },
  { img: 'assets/gallery/img-017-艳阳天.png', title: '艳阳天', author: '晴天', votes: 980, period: 'week' },
  { img: 'assets/gallery/img-016-连接.png', title: '连接', author: '桥本', votes: 860, period: 'month' },
  { img: 'assets/gallery/img-019-呼吸.png', title: '呼吸', author: '风铃', votes: 740, period: 'week' },
  { img: 'assets/gallery/img-024-风.png', title: '风', author: '山岚', votes: 620, period: 'month' }
];

function renderRankings(period) {
  period = period || 'all';
  const tbody = document.getElementById('rank-tbody');
  if (!tbody) return;
  const list = RANKINGS_DATA.filter(r => period === 'all' ? true : r.period === period);
  tbody.innerHTML = list.map((r, i) => `
    <tr>
      <td class="rank-no">${i + 1}</td>
      <td><img class="rank-thumb" src="${r.img}" alt=""></td>
      <td>${r.title}</td>
      <td><span class="rank-author"><span class="rank-avatar" style="background:${hashColor(r.author)}">${r.author.charAt(0)}</span>${r.author}</span></td>
      <td class="rank-score">${r.votes.toLocaleString()}</td>
    </tr>`).join('');
}

function filterRank(tabEl, period) {
  document.querySelectorAll('.rank-tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
  renderRankings(period);
}

// ── Upload + submit (demo) ──
let uploadedDataUrl = null;
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const uploadPreview = document.getElementById('upload-preview');

function handleFiles(fileList) {
  const file = fileList && fileList[0];
  if (!file) return;
  if (!file.type || !file.type.startsWith('image/')) {
    showToast('请上传图片文件');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedDataUrl = e.target.result;
    if (uploadPreview) uploadPreview.innerHTML = `<img src="${uploadedDataUrl}" alt="预览">`;
    const ph = document.querySelector('#upload-zone .upload-placeholder');
    if (ph) ph.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

if (uploadZone && fileInput) {
  uploadZone.addEventListener('click', (e) => {
    if (e.target.closest('.upload-preview')) return;
    fileInput.click();
  });
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', () => handleFiles(fileInput.files));
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const titleInput = form.querySelector('input[type=text]');
  if (!titleInput.value.trim()) {
    showToast('请填写作品标题');
    return false;
  }
  if (!uploadedDataUrl) {
    showToast('请上传作品图片');
    return false;
  }
  // Prepend the new work to the gallery
  const card = makeCard({ img: uploadedDataUrl, title: titleInput.value.trim(), author: currentUser }, 0);
  grid.insertBefore(card, grid.firstChild);
  // Reset form
  form.reset();
  if (uploadPreview) uploadPreview.innerHTML = '';
  const ph = document.querySelector('#upload-zone .upload-placeholder');
  if (ph) ph.style.display = '';
  uploadedDataUrl = null;
  showToast('🎉 作品提交成功！已进入展示区');
  switchView('gallery');
  return false;
}

// ── Toast ──
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ── Init rankings ──
renderRankings('all');
