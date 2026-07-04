const posts = [
  {
    slug: 'why-i-write',
    title: '为什么我要开始写自己的博客',
    date: '2026-07-04',
    readingTime: '4 分钟',
    tags: ['写作', '个人成长'],
    summary: '博客不是为了马上获得关注，而是给自己留下一个可以反复整理、沉淀和复盘的地方。',
    body: `<p>我想把零散的想法从聊天记录、文件夹和临时笔记里搬出来，放到一个更稳定的位置。博客的价值不只在发布，更在于持续整理。</p>
      <p>第一版不用追求复杂。能写文章、能归档、能被搜索、能放到自己的域名下面，就已经足够支撑长期积累。</p>
      <h2>我会记录什么</h2>
      <ul>
        <li>项目中的问题、判断和解决过程。</li>
        <li>读论文、读书或学习新工具时形成的笔记。</li>
        <li>阶段性复盘，以及未来想继续推进的方向。</li>
      </ul>
      <p>真正重要的是保持可维护：每篇文章都应该有清晰标题、日期、标签和一段摘要。这样几个月后回看，自己也能快速找回上下文。</p>`,
  },
  {
    slug: 'project-notes-template',
    title: '一篇项目笔记应该怎么写',
    date: '2026-07-03',
    readingTime: '5 分钟',
    tags: ['项目', '方法'],
    summary: '好的项目笔记不只是记录结果，还应该记录目标、约束、试错过程和下一步。',
    body: `<p>项目笔记最容易写成流水账。更有效的方式是把它写成一个可复用的判断记录：当时要解决什么，为什么选择这个方案，验证结果如何。</p>
      <h2>推荐结构</h2>
      <ul>
        <li>背景：这件事为什么要做。</li>
        <li>目标：希望达成什么可观察结果。</li>
        <li>过程：做了哪些尝试，遇到了哪些限制。</li>
        <li>结论：当前最可靠的判断是什么。</li>
        <li>下一步：还需要验证什么。</li>
      </ul>
      <p>只要坚持这个结构，博客就会慢慢从“文章集合”变成“自己的知识库”。</p>`,
  },
  {
    slug: 'github-pages-path',
    title: '把个人博客发布到 GitHub Pages 的最小路径',
    date: '2026-07-02',
    readingTime: '6 分钟',
    tags: ['GitHub', '发布'],
    summary: '静态博客最适合从 GitHub Pages 起步：文件简单、成本低，也方便以后迁移到独立域名。',
    body: `<p>这个博客是静态站点，核心文件只有 HTML、CSS、JavaScript 和资源图片。上传到 GitHub 仓库后，可以用 GitHub Pages 直接发布。</p>
      <h2>最小步骤</h2>
      <ul>
        <li>新建一个公开仓库，例如 <code>personal-blog</code>。</li>
        <li>把当前目录里的文件推送到仓库。</li>
        <li>在仓库设置里开启 Pages，来源选择主分支根目录。</li>
        <li>需要个人域名时，再添加自定义域名并配置 DNS。</li>
      </ul>
      <p>等文章越来越多，再考虑评论系统、统计、站内全文搜索和自动构建流程。</p>`,
  },
];

const state = { query: '', tag: '全部' };

const els = {
  root: document.documentElement,
  themeToggle: document.querySelector('#themeToggle'),
  year: document.querySelector('#year'),
  searchInput: document.querySelector('#searchInput'),
  tagList: document.querySelector('#tagList'),
  postList: document.querySelector('#postList'),
  postDetail: document.querySelector('#postDetail'),
  resultCount: document.querySelector('#resultCount'),
  viewTitle: document.querySelector('#viewTitle'),
};

function formatDate(value) {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function setTheme(theme) {
  els.root.dataset.theme = theme;
  localStorage.setItem('personal-blog-theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('personal-blog-theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(saved || preferred);
}

function allTags() {
  return ['全部', ...new Set(posts.flatMap((post) => post.tags))];
}

function renderTags() {
  els.tagList.innerHTML = allTags().map((tag) => `<button class='tag-button' type='button' data-tag='${tag}' aria-pressed='${state.tag === tag}'>${tag}</button>`).join('');
}

function filteredPosts() {
  const query = state.query.trim().toLowerCase();
  return posts.filter((post) => {
    const tagMatch = state.tag === '全部' || post.tags.includes(state.tag);
    const searchable = [post.title, post.summary, post.date, post.tags.join(' ')].join(' ').toLowerCase();
    return tagMatch && (!query || searchable.includes(query));
  });
}

function renderList() {
  const items = filteredPosts();
  els.postDetail.hidden = true;
  els.postList.hidden = false;
  els.viewTitle.textContent = state.tag === '全部' ? '最新文章' : `${state.tag} 相关文章`;
  els.resultCount.textContent = `${items.length} 篇`;

  if (!items.length) {
    els.postList.innerHTML = `<div class='empty-state'>没有找到匹配的文章。换个关键词或标签再试试。</div>`;
    return;
  }

  els.postList.innerHTML = items.map((post, index) => `<article class='post-card'>
      <div>
        <h3><a href='#post/${post.slug}'>${post.title}</a></h3>
        <div class='post-meta'><span>${formatDate(post.date)}</span><span>${post.readingTime}</span></div>
        <p class='post-summary'>${post.summary}</p>
        <div class='post-tags'>${post.tags.map((tag) => `<span class='tag'>${tag}</span>`).join('')}</div>
      </div>
      <span class='post-index'>${String(index + 1).padStart(2, '0')}</span>
    </article>`).join('');
}

function renderDetail(slug) {
  const post = posts.find((item) => item.slug === slug);
  if (!post) {
    window.location.hash = '#home';
    return;
  }
  els.postList.hidden = true;
  els.postDetail.hidden = false;
  els.viewTitle.textContent = '文章详情';
  els.resultCount.textContent = '';
  els.postDetail.innerHTML = `<a class='back-link' href='#home'>返回文章列表</a>
    <h1>${post.title}</h1>
    <div class='post-meta'><span>${formatDate(post.date)}</span><span>${post.readingTime}</span><span>${post.tags.join(' / ')}</span></div>
    <div class='post-body'>${post.body}</div>`;
  document.querySelector('#posts').scrollIntoView({ block: 'start' });
}

function route() {
  const hash = window.location.hash || '#home';
  if (hash.startsWith('#post/')) {
    renderDetail(hash.replace('#post/', ''));
    return;
  }
  renderList();
}

function bindEvents() {
  els.themeToggle.addEventListener('click', () => setTheme(els.root.dataset.theme === 'dark' ? 'light' : 'dark'));
  els.searchInput.addEventListener('input', (event) => {
    state.query = event.target.value;
    route();
  });
  els.tagList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-tag]');
    if (!button) return;
    state.tag = button.dataset.tag;
    renderTags();
    route();
  });
  window.addEventListener('hashchange', route);
}

els.year.textContent = new Date().getFullYear();
initTheme();
renderTags();
bindEvents();
route();
