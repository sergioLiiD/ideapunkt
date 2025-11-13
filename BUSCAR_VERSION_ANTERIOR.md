# 🔍 Buscar Versión Anterior en el Servidor

## 🎯 Objetivo
Encontrar dónde está la versión anterior que se está sirviendo.

## 🔍 Comandos para Ejecutar en SSH

### Paso 1: Buscar Archivos HTML Generados

**En SSH, ejecuta:**

```bash
# Buscar todos los archivos HTML en .next/server
find .next/server -name "*.html" -type f 2>/dev/null

# Ver el contenido de la página principal
find .next/server -name "index.html" -o -name "page.html" 2>/dev/null | head -5

# Ver el contenido de uno de esos archivos
cat .next/server/app/page.html 2>/dev/null || cat .next/server/app/index.html 2>/dev/null
```

**Busca en el contenido:**
- ¿Dice "ACTUALIZADO 2025-01-14"?
- ¿O dice algo diferente (versión anterior)?

### Paso 2: Buscar en Múltiples Ubicaciones

```bash
# Buscar archivos page.tsx en todo el servidor
find ~ -name "page.tsx" -type f 2>/dev/null

# Buscar archivos .next en todo el servidor
find ~ -name ".next" -type d 2>/dev/null

# Buscar BUILD_ID en todo el servidor
find ~ -name "BUILD_ID" -type f 2>/dev/null
```

### Paso 3: Verificar Qué BUILD_ID Tienen los Archivos HTML

```bash
# Ver el BUILD_ID actual
cat .next/BUILD_ID

# Buscar el BUILD_ID en los archivos HTML generados
grep -r "build-" .next/server/app/*.html 2>/dev/null | head -10
```

### Paso 4: Verificar Fechas de Archivos

```bash
# Ver fechas de archivos importantes
ls -la .next/server/app/*.html 2>/dev/null
ls -la .next/BUILD_ID
ls -la app/page.tsx

# Ver si hay archivos más recientes en otra ubicación
find ~ -name "page.tsx" -type f -exec ls -la {} \; 2>/dev/null
```

### Paso 5: Verificar Si Apache Está Sirviendo Desde Otra Ubicación

```bash
# Ver la configuración del dominio (si es accesible)
cat .htaccess | grep -i document
cat .htaccess | grep -i root

# Buscar archivos index.html en ubicaciones comunes
find ~ -name "index.html" -type f 2>/dev/null | grep -v node_modules | head -10
```

### Paso 6: Verificar el Contenido Real que se Está Sirviendo

```bash
# Ver el HTML generado en .next/server/app/
head -50 .next/server/app/page.html 2>/dev/null || head -50 .next/server/app/index.html 2>/dev/null

# Buscar texto específico de la versión anterior
grep -r "TRANSFORM YOUR BUSINESS" .next/server/app/ 2>/dev/null
grep -r "v2.0" .next/server/app/ 2>/dev/null
grep -r "ACTUALIZADO" .next/server/app/ 2>/dev/null
```

## 🎯 Qué Buscar

1. **Archivos HTML con fechas antiguas** - Si los archivos HTML en `.next/server/app/` tienen fechas del 13 de noviembre, esos son los que se están sirviendo.

2. **BUILD_ID diferente** - Si el BUILD_ID en los archivos HTML no coincide con el actual.

3. **Múltiples ubicaciones** - Si hay archivos en otras carpetas que Apache está sirviendo.

4. **Archivos estáticos cacheados** - Si hay archivos en `.next/static/` con fechas antiguas.

## 💡 Teoría Más Probable

Apache está sirviendo archivos HTML estáticos de `.next/server/app/` que fueron generados el 13 de noviembre (versión anterior). Estos archivos no se regeneran automáticamente cuando subes nuevos archivos - necesitas hacer un nuevo build.

## ✅ Solución Probable

Si los archivos HTML tienen fechas antiguas, necesitas:

1. **Regenerar el build en el servidor** (pero Node.js 12 no puede hacerlo)
2. **O subir el build completo desde tu máquina local**

Pero primero, ejecuta los comandos de arriba para confirmar dónde está la versión anterior.

