// main.js — render, filtros, vista previa, modal, GitHub API, idioma
const grid = document.getElementById('grid');
const filtersEl = document.getElementById('filters');
let activeFilter = 'all';
let lang = 'es';
const githubCache = {};

function githubUrl(repo){ return `https://github.com/${GITHUB_USER}/${repo}`; }
function desc(p){ return (lang === 'en' && p.description_en) ? p.description_en : p.description; }

function render(){
  grid.innerHTML = '';
  PROJECTS
    .filter(p => activeFilter === 'all' || p.tags.includes(activeFilter))
    .forEach((p) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-media">
          ${p.gif ? `<span class="badge-preview">Vista previa</span>` : ''}
          <span class="badge-lang">${p.lang || ''}</span>
          <div class="cover-art" style="background:${p.color || '#1e293b'}">${p.cover || p.title.slice(0,2).toUpperCase()}</div>
          ${p.gif ? `<img class="gif-preview" loading="lazy" src="${p.gif}" alt="Demostración de ${p.title}" onerror="this.remove()">` : ''}
          <span class="hover-hint">Pasar el cursor = demo · Clic = detalle</span>
        </div>
        <div class="card-body">
          <h3>${p.title}</h3>
          <p>${desc(p)}</p>
          <div class="tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div>
          <div class="card-foot">
            <a href="${githubUrl(p.repo)}" target="_blank" rel="noopener" data-stop>Ver en GitHub${githubCache[p.repo]?.stars ? ` · ★ ${githubCache[p.repo].stars}` : ''}</a>
            <span>${p.demo ? 'Demo disponible' : ''}</span>
          </div>
        </div>`;
      card.addEventListener('click', (e)=>{
        if(e.target.closest('[data-stop]')) return;
        openModal(p);
      });
      card.addEventListener('touchstart', ()=> card.classList.add('gif-on'), {passive:true});
      grid.appendChild(card);
    });
}

// Filtros
filtersEl.addEventListener('click', e=>{
  const b = e.target.closest('.chip'); if(!b) return;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  b.classList.add('active');
  activeFilter = b.dataset.filter;
  render();
});

// Vista previa animada on/off
document.getElementById('gifToggle').addEventListener('change', e=>{
  document.body.classList.toggle('no-gifs', !e.target.checked);
});

// Modal
const backdrop = document.getElementById('modalBackdrop');
function openModal(p){
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = desc(p);
  document.getElementById('modalTags').innerHTML = p.tags.map(t=>`<span>${t}</span>`).join('') + (p.lang?` <span>${p.lang}</span>`:'');
  document.getElementById('modalFeatures').innerHTML = (p.features||[]).map(f=>`<li>${f}</li>`).join('');
  document.getElementById('modalGithub').href = githubUrl(p.repo);
  const demo = document.getElementById('modalDemo');
  if(p.demo){ demo.style.display=''; demo.href=p.demo; } else demo.style.display='none';
  const media = document.getElementById('modalMedia');
  media.style.background = p.color || '#1e293b';
  media.innerHTML = p.gif
    ? `<img src="${p.gif}" alt="Demostración de ${p.title}" onerror="this.remove()">`
    : `<span>${p.cover || p.title.slice(0,2).toUpperCase()}</span>`;
  backdrop.classList.add('open');
}
document.getElementById('modalClose').onclick = ()=> backdrop.classList.remove('open');
backdrop.addEventListener('click', e=>{ if(e.target===backdrop) backdrop.classList.remove('open'); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') backdrop.classList.remove('open'); });

// Sincronizar con GitHub (API pública, sin permisos)
document.getElementById('loadGithub').addEventListener('click', async (e)=>{
  const btn = e.currentTarget; btn.disabled = true;
  const label = btn.querySelector('span');
  const original = label.textContent;
  label.textContent = 'Sincronizando…';
  try{
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    const repos = await res.json();
    let added = 0;
    repos.forEach(r=>{
      if(r.fork) return;
      if(!PROJECTS.find(p=>p.repo.toLowerCase()===r.name.toLowerCase())){
        PROJECTS.push({ repo:r.name, title:r.name, description:r.description||'Añade una descripción en js/projects.js (ver GUIA.md).', tags:['gameplay'], lang:r.language||'', gif:`assets/gifs/${r.name.toLowerCase()}.gif`, cover:r.name.slice(0,2).toUpperCase(), color:'#1e293b', features:[], demo:r.homepage||'' });
        added++;
      }
      githubCache[r.name] = { stars: r.stargazers_count };
    });
    repos.forEach(r=>{
      const p = PROJECTS.find(p=>p.repo.toLowerCase()===r.name.toLowerCase());
      if(p && !p.lang && r.language) p.lang = r.language;
    });
    render();
    updateHeroStats(repos);
    label.textContent = added ? `${added} proyecto(s) nuevo(s) detectado(s)` : 'Todo sincronizado';
  }catch{ label.textContent = 'Sin conexión con la API'; }
  setTimeout(()=>{ btn.disabled=false; label.textContent = original; }, 2500);
});

function updateHeroStats(repos){
  if(!repos?.length) return;
  document.getElementById('statRepos').textContent = repos.length;
  const stars = repos.reduce((a,r)=>a+r.stargazers_count,0);
  document.getElementById('statStars').textContent = stars;
}
fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`).then(r=>r.json()).then(repos=>{
  if(Array.isArray(repos)){
    repos.forEach(r=> githubCache[r.name]= {stars:r.stargazers_count});
    updateHeroStats(repos); render();
  }
}).catch(()=>{});

// Idioma ES/EN
document.getElementById('langToggle').addEventListener('click', e=>{
  lang = lang==='es'?'en':'es';
  e.target.textContent = lang==='es'?'EN':'ES';
  document.querySelectorAll('[data-es]').forEach(el=>{ el.textContent = el.dataset[lang]; });
  document.documentElement.lang = lang;
  render();
});

// Nav móvil
document.getElementById('burger').onclick = ()=> document.getElementById('mobileMenu').classList.toggle('open');
document.querySelectorAll('#mobileMenu a').forEach(a=>a.onclick=()=>document.getElementById('mobileMenu').classList.remove('open'));

render();
