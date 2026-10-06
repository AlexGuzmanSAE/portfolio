// main.js — render, filtros, hover GIFs, modal, GitHub API, i18n
const grid = document.getElementById('grid');
const filtersEl = document.getElementById('filters');
let activeFilter = 'all';
let lang = 'es';
const githubCache = {};

// ---------- RENDER ----------
function githubUrl(repo){ return `https://github.com/${GITHUB_USER}/${repo}`; }

function render(){
  grid.innerHTML = '';
  PROJECTS
    .filter(p => activeFilter === 'all' || p.tags.includes(activeFilter))
    .forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'card reveal visible';
      card.innerHTML = `
        <div class="card-media">
          ${p.gif ? `<span class="badge-gif">GIF ▸ hover</span>` : ''}
          <span class="badge-lang">${p.lang || ''}</span>
          <div class="cover-art" style="background:${p.gradient || 'linear-gradient(135deg,#131e2f,#0e1622)'}">${p.cover || '🎮'}</div>
          ${p.gif ? `<img class="gif-preview" loading="lazy" src="${p.gif}" alt="${p.title} gameplay" onerror="this.remove()">` : ''}
          <span class="hover-hint">👁 hover = gameplay · click = ficha</span>
        </div>
        <div class="card-body">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="tags">${p.tags.map(t=>`<span>#${t}</span>`).join('')}</div>
          <div class="card-foot">
            <a class="link-gh" href="${githubUrl(p.repo)}" target="_blank" rel="noopener" data-stop>↗ GitHub${githubCache[p.repo]?.stars ? ` · ★${githubCache[p.repo].stars}` : ''}</a>
            <span class="stars">${p.demo ? '▶ demo' : ''}</span>
          </div>
        </div>`;
      card.addEventListener('click', (e)=>{
        if(e.target.closest('[data-stop]')) return;
        openModal(p);
      });
      // táctil: primer tap muestra gif, segundo abre
      card.addEventListener('touchstart', ()=> card.classList.add('gif-on'), {passive:true});
      grid.appendChild(card);
    });
}

// ---------- FILTROS ----------
filtersEl.addEventListener('click', e=>{
  const b = e.target.closest('.chip'); if(!b) return;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  b.classList.add('active');
  activeFilter = b.dataset.filter;
  render();
});

// ---------- GIF TOGGLE ----------
document.getElementById('gifToggle').addEventListener('change', e=>{
  document.body.classList.toggle('no-gifs', !e.target.checked);
});

// ---------- MODAL ----------
const backdrop = document.getElementById('modalBackdrop');
function openModal(p){
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.description;
  document.getElementById('modalTags').innerHTML = p.tags.map(t=>`<span>#${t}</span>`).join('') + (p.lang?` <span>${p.lang}</span>`:'');
  document.getElementById('modalFeatures').innerHTML = (p.features||[]).map(f=>`<li>▸ ${f}</li>`).join('');
  document.getElementById('modalGithub').href = githubUrl(p.repo);
  const demo = document.getElementById('modalDemo');
  if(p.demo){ demo.style.display=''; demo.href=p.demo; } else demo.style.display='none';
  document.getElementById('modalMedia').innerHTML = p.gif
    ? `<img src="${p.gif}" alt="${p.title}" onerror="this.outerHTML='<div style=&quot;font-size:4rem&quot;>${p.cover||'🎮'}</div>'">`
    : `<div style="font-size:4rem;background:${p.gradient};width:100%;text-align:center;padding:3rem 0">${p.cover||'🎮'}</div>
       <p class="muted small" style="position:absolute;bottom:.5rem">Sube un GIF a <code>${p.gif||'assets/gifs/...'}</code> para ver gameplay aquí</p>`;
  backdrop.classList.add('open');
}
document.getElementById('modalClose').onclick = ()=> backdrop.classList.remove('open');
backdrop.addEventListener('click', e=>{ if(e.target===backdrop) backdrop.classList.remove('open'); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') backdrop.classList.remove('open'); });

// ---------- AUTO-CARGAR DESDE GITHUB ----------
document.getElementById('loadGithub').addEventListener('click', async (e)=>{
  const btn = e.currentTarget; btn.disabled = true; btn.textContent = '⏳ cargando…';
  try{
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    const repos = await res.json();
    let added = 0;
    repos.forEach(r=>{
      if(r.fork) return;
      if(!PROJECTS.find(p=>p.repo.toLowerCase()===r.name.toLowerCase())){
        PROJECTS.push({ repo:r.name, title:r.name, description:r.description||'Sin descripción todavía — edítala en js/projects.js', tags:['gameplay'], lang:r.language||'', gif:`assets/gifs/${r.name.toLowerCase()}.gif`, cover:'🎮', gradient:'linear-gradient(135deg,#131e2f,#1e2d45)', features:[], demo:r.homepage||'' });
        added++;
      }
      githubCache[r.name] = { stars: r.stargazers_count };
    });
    // actualizar estrellas de los existentes
    repos.forEach(r=>{
      const p = PROJECTS.find(p=>p.repo.toLowerCase()===r.name.toLowerCase());
      if(p && !p.lang && r.language) p.lang = r.language;
    });
    render();
    updateHeroStats(repos);
    btn.textContent = added ? `✓ ${added} nuevos añadidos` : '✓ ya está al día';
  }catch{ btn.textContent = '⚠ sin conexión a API'; }
  setTimeout(()=>{ btn.disabled=false; btn.innerHTML='↻ <span>Auto-cargar desde GitHub</span>'; }, 2500);
});

function updateHeroStats(repos){
  if(!repos?.length) return;
  document.getElementById('statRepos').textContent = repos.length;
  const stars = repos.reduce((a,r)=>a+r.stargazers_count,0);
  document.getElementById('statStars').textContent = stars;
}
// estrellas iniciales (silencioso)
fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`).then(r=>r.json()).then(repos=>{
  if(Array.isArray(repos)){
    repos.forEach(r=> githubCache[r.name]= {stars:r.stargazers_count});
    updateHeroStats(repos); render();
  }
}).catch(()=>{});

// ---------- TYPED ----------
const phrases = ['Gameplay Programmer', 'Engine / C++ Dev', 'Graphics & Shaders', 'Unity · OpenGL · C#', 'Game-feel enjoyer'];
let pi=0, ci=0, del=false;
const typedEl = document.getElementById('typed');
(function type(){
  const cur = phrases[pi];
  typedEl.textContent = cur.slice(0, ci);
  if(!del && ci < cur.length){ ci++; }
  else if(!del){ del=true; setTimeout(type,1400); return; }
  else { ci--; if(ci===0){ del=false; pi=(pi+1)%phrases.length; } }
  setTimeout(type, del?30:60);
})();

// ---------- MARQUEE duplicado ----------
const mq = document.getElementById('marquee');
mq.textContent = (mq.textContent+' ').repeat(3);

// ---------- IDIOMA ----------
document.getElementById('langToggle').addEventListener('click', e=>{
  lang = lang==='es'?'en':'es';
  e.target.textContent = lang==='es'?'EN':'ES';
  document.querySelectorAll('[data-es]').forEach(el=>{ el.textContent = el.dataset[lang]; });
  document.documentElement.lang = lang;
});

// ---------- NAV móvil / reveal ----------
document.getElementById('burger').onclick = ()=> document.getElementById('mobileMenu').classList.toggle('open');
document.querySelectorAll('#mobileMenu a').forEach(a=>a.onclick=()=>document.getElementById('mobileMenu').classList.remove('open'));

// mail placeholder
if(document.getElementById('mailBtn').href.includes('alexguzman.dev')){
  // deja el placeholder, el usuario lo cambia en index.html
}

render();
