# Campaña ITI — Facundo Presa

Sitio web de campana estudiantil para el Consejo de Participacion del ITI.

## Desarrollo

```bash
bun install
bun dev
```

Requiere Bun. No uses npm o node directamente.

## Agregar documentos

1. Crea un archivo `.md` en `public/docs/` con este formato:

```markdown
---
title: "Titulo de la propuesta"
date: "2026-05-01"
category: "Infraestructura"
lang: "es"
pinned: false
---

Contenido en Markdown...
```

1. Agrega una entrada en `public/docs/index.json`:

```json
{
  "slug": "nombre-del-archivo-sin-extension",
  "title": "Titulo de la propuesta",
  "date": "2026-05-01",
  "category": "Infraestructura",
  "lang": "es",
  "pinned": false,
  "excerpt": "Resumen de hasta 120 caracteres que aparece en el listado."
}
```

El `slug` debe coincidir exactamente con el nombre del archivo (sin `.md`).

## Configurar el sitio

Edita `src/config.ts` para cambiar:

- Nombre y datos del candidato
- Bio en espanol e ingles
- Redes sociales
- Documentos destacados en el inicio (por slug)

## Agregar el logo

Coloca tu logo en `public/assets/logo.svg` (o `.png`). Hasta entonces se muestra el texto "FP".

## Agregar foto de perfil

Coloca una foto en `public/assets/avatar.jpg`. Hasta entonces se muestra un placeholder.

## Deploy

### Vercel

```bash
bun run build
# Sube la carpeta dist/, o conecta el repo a Vercel
# Build command: bun run build
# Output directory: dist
```

### Netlify

Igual que Vercel. Build command `bun run build`, publish directory `dist`.

## Scripts

```bash
bun dev          # Servidor de desarrollo
bun run build    # Build de produccion
bun run typecheck # Verificar tipos TypeScript
bun run lint     # Linting con OxLint
```
