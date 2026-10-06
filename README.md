# 🎮 Alex Guzmán — Portfolio (GitHub Pages ready)

Portafolio de programador de videojuegos. Profesional + estilo arcade.
- Hover en tarjetas = GIF de gameplay
- Click = ficha completa
- Filtros por disciplina
- Auto-carga estrellas y repos desde la API pública de GitHub (sin permisos/token)

## 🚀 Publicar en GitHub Pages (5 min)

**Opción A — URL bonita `alexguzmansae.github.io`:**
1. Crea un repo nuevo llamado exactamente `AlexGuzmanSAE.github.io` (público)
2. Sube estos archivos a la rama `main` (arrastra la carpeta en la web de GitHub o haz `git push`)
3. Ve a `Settings → Pages → Deploy from branch → main / root` → Save
4. Tu web estará en `https://alexguzmansae.github.io` en ~1 min

**Opción B — como subpágina:**
1. Crea un repo `portfolio`, sube los archivos, `Settings → Pages → main / root`
2. URL: `https://alexguzmansae.github.io/portfolio/`

No necesitas darme permisos: tus repos son públicos y la web usa la API pública.

## ➕ Añadir un repositorio (30 seg)

1. Graba un GIF del juego (OBS / ScreenToGif / LICEcap, ~800px ancho, <5MB)
2. Guárdalo en `assets/gifs/mi-juego.gif`
3. Abre `js/projects.js` y añade:
```js
{
  repo: "NombreExactoDelRepo",
  title: "Nombre bonito",
  description: "Qué es + qué programaste tú",
  tags: ["gameplay"], // gameplay | engine | graphics | ai | mobile
  lang: "C#",
  gif: "assets/gifs/mi-juego.gif",
  cover: "🎯",
  features: ["Punto 1", "Punto 2"],
  demo: "https://link-a-build-o-video",
},
```
4. Commit + push. Listo.

Tip: si no tienes GIF aún, deja `gif: ""` y saldrá la portada con emoji degradado. El botón **"Auto-cargar desde GitHub"** de la web detecta repos nuevos y te dice cuántos faltan por documentar.

## ✏️ Personalizar
- Email / LinkedIn: edita el bloque `#contacto` en `index.html` (busca `mailto:`)
- Foto: ya tira de tu avatar de GitHub automáticamente
- Colores: variables en `css/style.css` (`--cyan`, `--pink`, etc.)
- Idioma: la web lleva toggle ES/EN integrado (atributos `data-es` / `data-en`)

## 📁 Estructura
```
index.html
css/style.css
js/projects.js  ← edita aquí tus proyectos
js/main.js
assets/gifs/    ← sube aquí tus GIFs
```
