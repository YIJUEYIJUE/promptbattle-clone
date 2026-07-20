// ═══════════════════════════════════════
// PromptBattle Clone — Gallery Renderer
// ═══════════════════════════════════════

const GALLERY_DATA = [
  { img: 'assets/gallery/img-001-一种情绪.png', title: '一种情绪' },
  { img: 'assets/gallery/img-002-独自升级.png', title: '独自升级' },
  { img: 'assets/gallery/img-003-鸟为什么会飞.png', title: '鸟为什么会飞' },
  { img: 'assets/gallery/img-004-酸.png', title: '酸' },
  { img: 'assets/gallery/img-005-微缩世界.png', title: '微缩世界' },
  { img: 'assets/gallery/img-006-神经质.png', title: '【复活赛】神经质' },
  { img: 'assets/gallery/img-007-月亮之上.png', title: '月亮之上 / 爱情买卖' },
  { img: 'assets/gallery/img-008-生活搭子.webp', title: '生活搭子' },
  { img: 'assets/gallery/img-009-英雄之旅.png', title: '英雄之旅' },
  { img: 'assets/gallery/img-010-时间到.png', title: '时间到' },
  { img: 'assets/gallery/img-011-否极泰来.png', title: '否极泰来' },
  { img: 'assets/gallery/img-012-右3-4照.png', title: '右3-4照' },
  { img: 'assets/gallery/img-013-像素.png', title: '像素' },
  { img: 'assets/gallery/img-014-失重.png', title: '失重' },
  { img: 'assets/gallery/img-015-图书馆的情侣.png', title: '图书馆的情侣' },
  { img: 'assets/gallery/img-016-连接.png', title: '连接' },
  { img: 'assets/gallery/img-017-艳阳天.png', title: '艳阳天' },
  { img: 'assets/gallery/img-018-芳草地.png', title: '芳草地' },
  { img: 'assets/gallery/img-019-呼吸.png', title: '呼吸' },
  { img: 'assets/gallery/img-020-牛顿水.png', title: '牛顿水' },
  { img: 'assets/gallery/img-021-柚子buff.png', title: '柚子buff' },
  { img: 'assets/gallery/img-022-100种颜色.png', title: '100种颜色' },
  { img: 'assets/gallery/img-023-呼吸2.png', title: '呼吸2' },
  { img: 'assets/gallery/img-024-风.png', title: '风' },
  { img: 'assets/gallery/img-025-水墨.png', title: '水墨' },
  { img: 'assets/gallery/img-026-基因与环境.png', title: '基因与环境' },
  { img: 'assets/gallery/img-027-龙卷风.png', title: '龙卷风' },
  { img: 'assets/gallery/img-028-迟到千年.png', title: '迟到千年' },
  { img: 'assets/gallery/img-029-你将漂流一生.png', title: '你将漂流一生' },
  { img: 'assets/gallery/img-030-惊叫中的恐惧.png', title: '惊叫中的恐惧' }
];

// Deterministic color from string (for initials avatar)
function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  const hue = Math.abs(h) % 360;
  return `hsl(${hue}, 45%, 55%)`;
}

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
  img.alt = item.title;
  img.loading = 'lazy';

  const avatar = document.createElement('div');
  avatar.className = 'card-avatar-wrap';
  const initial = (item.title || '?').trim().charAt(0);
  avatar.style.background = hashColor(item.title || 'x');
  avatar.textContent = initial;
  avatar.title = item.title;

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = item.title;

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

// Initial render
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

// Lightbox
let lightbox;
function openLightbox(item) {
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
      <div class="lb-backdrop"></div>
      <div class="lb-content">
        <button class="lb-close" aria-label="关闭">&times;</button>
        <img class="lb-img" alt="">
        <div class="lb-caption"></div>
      </div>`;
    document.body.appendChild(lightbox);
    lightbox.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }
  lightbox.querySelector('.lb-img').src = item.img;
  lightbox.querySelector('.lb-caption').textContent = item.title;
  lightbox.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (lightbox) lightbox.classList.remove('show');
  document.body.style.overflow = '';
}
