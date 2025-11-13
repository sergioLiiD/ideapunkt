#!/bin/bash

# Script para verificar el estado del servidor después del despliegue
# Ejecutar ESTE script EN EL SERVIDOR (DreamHost) por SSH

echo "🔍 Verificando estado del servidor..."
echo ""

# Verificar BUILD_ID
if [ -f ".next/BUILD_ID" ]; then
  BUILD_ID=$(cat .next/BUILD_ID)
  echo "✅ BUILD_ID en servidor: $BUILD_ID"
  echo "   (Debería ser: build-1763037971591)"
  
  if [ "$BUILD_ID" = "build-1763037971591" ]; then
    echo "   ✅ BUILD_ID CORRECTO"
  else
    echo "   ❌ BUILD_ID INCORRECTO - Los archivos no se actualizaron"
  fi
else
  echo "❌ ERROR: No existe .next/BUILD_ID"
  echo "   Los archivos no se subieron correctamente"
fi

echo ""
echo "📁 Verificando estructura:"

# Verificar carpetas esenciales
if [ -d ".next/server" ]; then
  echo "  ✅ .next/server/ existe"
else
  echo "  ❌ .next/server/ NO existe"
fi

if [ -d ".next/static" ]; then
  echo "  ✅ .next/static/ existe"
  STATIC_FILES=$(find .next/static -type f | wc -l | tr -d ' ')
  echo "     Archivos estáticos: $STATIC_FILES"
else
  echo "  ❌ .next/static/ NO existe"
fi

# Verificar archivos de configuración
echo ""
echo "📄 Verificando archivos de configuración:"

if [ -f "next.config.js" ]; then
  if grep -q "generateBuildId" next.config.js; then
    echo "  ✅ next.config.js tiene generateBuildId configurado"
  else
    echo "  ⚠️  next.config.js NO tiene generateBuildId"
  fi
else
  echo "  ❌ next.config.js NO existe"
fi

if [ -f ".htaccess" ]; then
  if grep -q "Cache-Control" .htaccess; then
    echo "  ✅ .htaccess tiene configuración de caché"
  else
    echo "  ⚠️  .htaccess NO tiene configuración de caché"
  fi
else
  echo "  ⚠️  .htaccess NO existe (puede ser normal)"
fi

# Verificar archivo de versión
echo ""
echo "📋 Verificando archivo de versión:"
if [ -f "public/version.txt" ]; then
  echo "  ✅ public/version.txt existe"
  cat public/version.txt
else
  echo "  ⚠️  public/version.txt NO existe"
fi

# Verificar proceso de Node.js
echo ""
echo "🔄 Verificando proceso de Node.js/Passenger:"
if [ -f "tmp/restart.txt" ]; then
  echo "  ✅ tmp/restart.txt existe (Passenger debería reiniciarse)"
  echo "     Última modificación: $(stat -c %y tmp/restart.txt 2>/dev/null || stat -f %Sm tmp/restart.txt 2>/dev/null || echo 'N/A')"
else
  echo "  ⚠️  tmp/restart.txt NO existe"
  echo "     Ejecuta: touch tmp/restart.txt"
fi

# Verificar permisos
echo ""
echo "🔐 Verificando permisos:"
if [ -r ".next/BUILD_ID" ]; then
  echo "  ✅ .next/BUILD_ID es legible"
else
  echo "  ❌ .next/BUILD_ID NO es legible (problema de permisos)"
fi

# Verificar tamaño del build
echo ""
echo "📊 Tamaño del build:"
if [ -d ".next" ]; then
  du -sh .next 2>/dev/null || echo "  No se pudo calcular"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 ACCIONES RECOMENDADAS:"
echo ""
echo "1. Si BUILD_ID es incorrecto:"
echo "   - Verifica que subiste TODOS los archivos"
echo "   - Especialmente la carpeta .next/ completa"
echo ""
echo "2. Si BUILD_ID es correcto pero ves versión antigua:"
echo "   - Reinicia Passenger: touch tmp/restart.txt"
echo "   - Espera 30 segundos"
echo "   - Limpia caché del navegador (Ctrl+Shift+R)"
echo "   - Prueba en modo incógnito"
echo ""
echo "3. Verifica el archivo de versión en el navegador:"
echo "   https://ideapunkt.de/version.txt"
echo "   Debería mostrar: BUILD_ID: build-1763037971591"
echo ""
echo "4. Verifica los headers HTTP:"
echo "   curl -I https://ideapunkt.de"
echo "   Debería mostrar Cache-Control: no-cache"
echo ""

