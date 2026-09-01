# Madrid a escena

Web estática de la cartelera teatral de Madrid. No necesita servidor, base de datos ni instalación: los archivos de esta carpeta se pueden publicar gratis con GitHub Pages.

**Web:** https://aronfenix.github.io/madrid-a-escena/

Incluye búsqueda, filtros por teatro/mes/tipo/prioridad, ordenación por fecha o ranking, fichas editoriales desplegables, filtro rápido de imprescindibles, favoritas guardadas en el navegador y botón para compartir.

## Publicarla por primera vez en GitHub Pages

El repositorio ya está preparado con estos archivos en la raíz. Las instrucciones siguientes sirven como referencia si quieres repetir el proceso con otra cartelera.

1. Entra en [github.com](https://github.com) y crea una cuenta si todavía no tienes una.
2. Pulsa el botón **+** de la esquina superior derecha y elige **New repository**.
3. En **Repository name**, escribe un nombre sencillo, por ejemplo `madrid-a-escena`.
4. Marca **Public**. GitHub Pages es gratuito para repositorios públicos.
5. Pulsa **Create repository**.
6. En la página del repositorio, pulsa **uploading an existing file**.
7. Arrastra a la zona de subida todos los archivos de esta carpeta: `index.html`, `styles.css`, `app.js`, `data.json`, `editorial.json`, `og.png`, `.nojekyll` y este `README.md`.
8. Al final de la página, pulsa **Commit changes**.
9. Abre la pestaña **Settings** del repositorio.
10. En el menú izquierdo, entra en **Pages**.
11. En **Build and deployment**, elige **Deploy from a branch**.
12. Selecciona la rama **main**, la carpeta **/ (root)** y pulsa **Save**.
13. Espera uno o dos minutos y vuelve a esa misma pantalla. GitHub mostrará la dirección pública, normalmente `https://TU-USUARIO.github.io/madrid-a-escena/`.

Esa es la dirección que puedes enviar a tus amigos. Si al principio aparece una página 404, espera un minuto y recarga: la primera publicación puede tardar un poco.

## Añadir una obra nueva

Toda la cartelera vive en `data.json`. La ficha editorial ampliada (casting, dirección, dramaturgia y “por qué mola”) vive en `editorial.json`. El diseño y los filtros están en los demás archivos y no hace falta tocarlos al añadir obras.

1. Abre `data.json` dentro de GitHub.
2. Pulsa el icono del lápiz, **Edit this file**.
3. Copia uno de los bloques existentes y pégalo antes del último corchete `]`.
4. Pon una coma después del bloque anterior.
5. Cambia los valores de la nueva obra.
6. Pulsa **Commit changes** y confirma de nuevo.

Plantilla de una obra:

```json
{
  "id": "nombre-corto-sin-acentos",
  "title": "Nombre de la obra",
  "theatre": "Nombre del teatro",
  "type": "Estreno",
  "dates": "5–20 feb",
  "price": "Desde 18 €",
  "rank": 48,
  "priority": 4,
  "startDate": "2027-02-05",
  "months": ["feb"],
  "ticketUrl": "https://direccion-oficial-de-venta.example"
}
```

Qué significa cada campo:

- `id`: identificador único. Usa minúsculas, guiones y ninguna tilde.
- `title`: nombre visible de la obra.
- `theatre`: nombre visible y opción del filtro por teatro.
- `type`: estreno, reposición, nuevo montaje, etc. Se conserva tal cual en el filtro.
- `dates`: texto que verá el público.
- `price`: precio visible; puede incluir “Desde” o “≈”.
- `rank`: puesto en el ranking general. El número menor aparece primero al ordenar por ranking.
- `priority`: número del 1 al 5. La lista actual utiliza valores del 2 al 5.
- `startDate`: fecha real de inicio en formato `año-mes-día`; permite ordenar correctamente.
- `months`: meses durante los que se representa. Si cruza varios, por ejemplo `["ene", "feb"]`.
- `ticketUrl`: enlace oficial de compra. Escribe `null` mientras no esté disponible; la web mostrará “Enlace pendiente”.

## Añadir un mes nuevo al filtro

Si incorporas febrero, marzo u otro mes que todavía no aparece:

1. Abre `index.html` y pulsa el lápiz.
2. Busca el selector con `id="month"`.
3. Añade una línea como `<option value="feb">Febrero</option>` junto a los demás meses.
4. Guarda con **Commit changes**.

Después ya puedes usar `"months": ["feb"]` en las obras nuevas.

## Corregir una obra o añadir entradas

Edita únicamente su bloque en `data.json`. Para añadir el botón de compra, sustituye:

```json
"ticketUrl": null
```

por:

```json
"ticketUrl": "https://enlace-oficial-de-compra"
```

Guarda con **Commit changes**. GitHub Pages actualiza la web automáticamente, normalmente en uno o dos minutos.

## Evitar errores frecuentes

- Cada bloque salvo el último termina con coma.
- Los textos van entre comillas dobles.
- `rank` y `priority` son números y no llevan comillas.
- `ticketUrl` puede ser una dirección entre comillas o `null` sin comillas.
- No borres los corchetes `[` y `]` del principio y el final.

Si después de editar la página deja de cargar, revisa primero la coma del bloque que acabas de añadir. Puedes recuperar cualquier versión anterior desde la pestaña **History** del archivo en GitHub.

## Qué archivo hace cada cosa

- `index.html`: estructura de la página y opciones de meses.
- `styles.css`: colores, tipografías, tarjetas y adaptación a móvil.
- `app.js`: búsqueda, filtros, ordenación y botones.
- `data.json`: las obras; es el archivo que se actualiza habitualmente.
- `editorial.json`: información ampliada de cada obra; se edita usando el mismo `id` que en `data.json`.
- `og.png`: imagen que puede mostrarse al compartir el enlace.
- `.nojekyll`: evita que GitHub Pages transforme la web.
- `robots.txt` y `sitemap.xml`: ayudan a los buscadores a descubrir la página pública.
