#!/bin/bash

# Script para verificar el build y limpiar caché
# Uso: ./verificar-build.sh

echo "🔍 Verificando build de Next.js..."
echo ""

PROJECT_DIR="/Users/sergio/Projects/landing-ideapunkt"
cd "$PROJECT_DIR"

# Verificar si existe .next
if [ ! -d ".next" ]; then
  echo "❌ ERROR: No existe la carpeta .next/"
  echo "   Ejecuta primero: npm run build"
  exit 1
fi

# Verificar BUILD_ID
if [ -f ".next/BUILD_ID" ]; then
  BUILD_ID=$(cat .next/BUILD_ID)
  echo "✅ BUILD_ID encontrado: $BUILD_ID"
  echo "   Timestamp: $(date -r .next/BUILD_ID 2>/dev/null || echo 'N/A')"
else
  echo "⚠️  BUILD_ID no encontrado"
fi

# Verificar estructura del build
echo ""
echo "📁 Verificando estructura del build:"
echo ""

if [ -d ".next/server" ]; then
  echo "  ✅ .next/server/ existe"
else
  echo "  ❌ .next/server/ NO existe"
fi

if [ -d ".next/static" ]; then
  echo "  ✅ .next/static/ existe"
  STATIC_COUNT=$(find .next/static -type f | wc -l | tr -d ' ')
  echo "     Archivos estáticos: $STATIC_COUNT"
else
  echo "  ❌ .next/static/ NO existe"
fi

if [ -f ".next/server/app/page.js" ] || [ -f ".next/server/app/page.js.nft.json" ]; then
  echo "  ✅ Página principal compilada"
else
  echo "  ⚠️  Página principal no encontrada en .next/server/app/"
fi

# Verificar API route
if [ -d ".next/server/app/api/chat" ]; then
  echo "  ✅ API route /api/chat existe"
else
  echo "  ⚠️  API route /api/chat no encontrada"
fi

# Limpiar caché local de Next.js
echo ""
echo "🧹 Limpiando caché local..."
rm -rf .next/cache
echo "  ✅ Caché de Next.js limpiada"

# Mostrar tamaño del build
echo ""
echo "📊 Tamaño del build:"
du -sh .next 2>/dev/null || echo "  No se pudo calcular"

echo ""
echo "✅ Verificación completada"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Asegúrate de que el BUILD_ID es diferente al anterior"
echo "   2. Sube TODOS los archivos actualizados al servidor"
echo "   3. En el servidor, ejecuta: touch tmp/restart.txt (para reiniciar Passenger)"
echo "   4. Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)"
echo ""

