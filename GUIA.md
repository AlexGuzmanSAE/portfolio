# Guía: cómo rellenar tus datos y descripciones

Solo hay **2 archivos que editar**: `index.html` (datos personales) y `js/projects.js` (proyectos).
Los GIFs van en `assets/gifs/`. Todo lo demás es automático.

---

## 1. Datos personales (`index.html`)

Abre `index.html` y busca cada texto. Edítalo directamente.

| Qué cambiar | Dónde (busca esto) | Ejemplo |
|---|---|---|
| Email | `mailto:hola@alexguzman.dev` (hay 1, en Contacto) | `mailto:alex.guzman@email.com` |
| LinkedIn | `https://www.linkedin.com/` | `https://www.linkedin.com/in/alexguzman/` |
| Ubicación | `España · abierto a remoto` | `Madrid · abierto a remoto` |
| Titular profesional | `Programador de videojuegos — Gameplay · Motor · Gráficos` | Ajusta a tu enfoque real |
| Descripción hero | párrafo bajo el titular | 2–3 líneas: quién eres, con qué trabajas, qué buscas |
| Formación | `Programación de videojuegos — SAE` | Tu título real |
| Idiomas | `Español (nativo) · Inglés (técnico)` | Tu nivel real |
| Foto | `https://avatars.githubusercontent.com/...` | Se usa tu avatar de GitHub. Para foto propia: súbela a `assets/foto.jpg` y cambia el `src` |

**Idioma EN:** cada texto en español lleva al lado su `data-en="..."`. Si cambias el español, cambia también el inglés entre comillas.

---

## 2. Proyectos (`js/projects.js`)

Cada proyecto es un bloque como este. Cópialo para añadir uno nuevo:

```js
{
  repo: "NombreExactoEnGitHub",
  title: "Nombre para mostrar",
  description: "Descripción en español (1-2 líneas).",
  description_en: "English description (1-2 lines).",
  tags: ["gameplay"],
  lang: "C#",
  gif: "assets/gifs/mi-juego.gif",
  cover: "MJ",
  color: "#1e3a5f",
  features: ["Punto técnico 1", "Punto técnico 2", "Punto técnico 3"],
  demo: "",
},
```

### 2.1 `repo` (obligatorio, exacto)
El nombre exacto del repositorio en GitHub, respetando mayúsculas. Es lo que construye el enlace. Ejemplo: `repo: "dwaRTS"` → `github.com/AlexGuzmanSAE/dwaRTS`.

### 2.2 `title`
Nombre legible. Puede incluir aclaración: `"dwaRTS — RTS en C++"`.

### 2.3 `description` — fórmula recomendada
Estructura en 1–2 líneas: **qué es + con qué lo hiciste + qué hiciste tú**.

- Bien: `"Plataformas vertical en Unity (C#). Implementé el controlador del personaje, la progresión por niveles y el HUD."`
- Evitar: `"Mi jueguito molón"` / dejarlo vacío / pegar la descripción de GitHub sin más.

`description_en`: lo mismo en inglés. Si lo omites, la web muestra el español en ambos idiomas.

### 2.4 `tags` (filtros)
Elige 1–3 de esta lista cerrada (son los botones de filtro):
`gameplay` · `engine` · `graphics` · `ai` · `mobile`

- Gameplay: controles, combate, niveles, HUD.
- Motor (`engine` en código, se muestra "Motor"): bucle, entidades, serialización, herramientas.
- Gráficos: OpenGL, shaders, render, partículas.
- IA: estados, pathfinding, Bayes/ML.
- Móvil/Web: táctil, responsive, HTML.

### 2.5 `lang`
Lenguaje principal para la insignia: `"C++"`, `"C#"`, `"C"`, `"ShaderLab"`, `"HTML"`. Si lo dejas vacío, el botón "Sincronizar con GitHub" lo rellena solo.

### 2.6 `gif` — la demostración en hover
1. Graba 5–10 s de gameplay (OBS, ScreenToGif o LICEcap). Recomendado: 800 px de ancho, < 5 MB.
2. Guárdalo en `assets/gifs/` con nombre en minúsculas y guiones, ej: `assets/gifs/mi-juego.gif`.
3. Pon esa misma ruta en `gif`. Si aún no tienes GIF, pon `gif: ""` y se verá la portada con iniciales.

### 2.7 `cover` y `color` (portada sin GIF)
- `cover`: 2–3 iniciales, ej `"MC"`, `"RTS"`.
- `color`: color sobrio de fondo, ej `"#1e3a5f"`. Puedes usar cualquier hexadecimal.

### 2.8 `features` — 3 puntos técnicos (lo que miran los reclutadores)
Fórmula: **sistema + técnica + resultado**. 3 viñetas bastan.

- Bien: `"Controlador con coyote-time y jump-buffer"`, `"Máquina de estados: reposo / mover / atacar"`, `"Iluminación Phong con shaders GLSL"`.
- Evitar: `"Lo hice yo todo"` / `"Muchas cosas"` / dejarlo vacío.

### 2.9 `demo`
Enlace opcional a build jugable (itch.io, GitHub Release) o vídeo. Si lo rellenas, aparece "Demo disponible". Si no, `""`.

---

## 3. Añadir un proyecto nuevo (resumen)

1. Sube el GIF a `assets/gifs/nuevo.gif`.
2. Añade un bloque en `js/projects.js` (copia uno existente).
3. Guarda, haz commit en GitHub Desktop y push. GitHub Pages lo publica en ~1 min.
4. Alternativa: pulsa **"Sincronizar con GitHub"** en la web; detecta repos que aún no documentaste y te dice cuántos son. Luego los describes en `js/projects.js`.

## 4. Publicar cambios (GitHub Desktop)

1. Abre GitHub Desktop → el repo `portfolio`.
2. Revisa los cambios → escribe un mensaje (ej: `"Añado descripción de dwaRTS"`) → Commit.
3. Push (botón superior). Espera 1 min y recarga tu URL de Pages.

## 5. Lista de comprobación antes de compartir el enlace

- [ ] Email y LinkedIn reales en `index.html`.
- [ ] Cada proyecto tiene `description` con la fórmula qué + con qué + qué hiciste.
- [ ] Cada proyecto tiene 3 `features` técnicos.
- [ ] GIFs < 5 MB (la página debe cargar rápido).
- [ ] Botón "Sincronizar con GitHub" no reporta repos sin documentar.
