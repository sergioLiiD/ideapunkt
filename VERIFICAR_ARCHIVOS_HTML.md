# 🔍 Verificar Archivos HTML Generados

## Comandos para Ejecutar

### Paso 1: Buscar archivos HTML en .next/server/app/

```bash
find .next/server/app -name "*.html" -type f 2>/dev/null
```

### Paso 2: Ver qué hay en .next/server/app/

```bash
ls -la .next/server/app/
```

### Paso 3: Ver estructura completa de .next/server/app/

```bash
find .next/server/app -type f | head -30
```

### Paso 4: Verificar si hay archivos page.js o page.html

```bash
find .next/server/app -name "page.*" -type f 2>/dev/null
```

### Paso 5: Verificar si Next.js generó archivos estáticos

```bash
ls -la .next/server/app/page/ 2>/dev/null || echo "No existe page/"
ls -la .next/server/app/_not-found/ 2>/dev/null || echo "No existe _not-found/"
```

## 🎯 Teoría

Next.js 14 con App Router puede generar archivos de diferentes formas:
- Puede generar archivos `.js` que se ejecutan en el servidor
- O puede generar archivos HTML estáticos

Necesitamos ver qué generó realmente.

