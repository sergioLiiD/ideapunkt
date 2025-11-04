#!/bin/bash

# Script para preparar archivos para subir a DreamHost
# Uso: ./prepare-upload.sh

echo "🚀 Preparando archivos para subir a DreamHost..."
echo ""

# Crear carpeta temporal
UPLOAD_DIR="$HOME/ideapunkt-upload"
PROJECT_DIR="/Users/sergio/Projects/landing-ideapunkt"

echo "📁 Creando carpeta temporal: $UPLOAD_DIR"
rm -rf "$UPLOAD_DIR"
mkdir -p "$UPLOAD_DIR"

cd "$PROJECT_DIR"

echo ""
echo "📦 Copiando archivos..."

# Copiar carpeta .next completa
echo "  - Copiando .next/..."
cp -r .next "$UPLOAD_DIR/" 2>/dev/null || echo "    ⚠️  .next/ no encontrado (ejecuta npm run build primero)"

# Copiar carpeta public
echo "  - Copiando public/..."
cp -r public "$UPLOAD_DIR/" 2>/dev/null || echo "    ⚠️  public/ no encontrado"

# Copiar carpeta app
echo "  - Copiando app/..."
cp -r app "$UPLOAD_DIR/" 2>/dev/null || echo "    ⚠️  app/ no encontrado"

# Copiar carpeta components
echo "  - Copiando components/..."
cp -r components "$UPLOAD_DIR/" 2>/dev/null || echo "    ⚠️  components/ no encontrado"

# Copiar archivos de configuración
echo "  - Copiando archivos de configuración..."
cp package.json "$UPLOAD_DIR/" 2>/dev/null
cp package-lock.json "$UPLOAD_DIR/" 2>/dev/null
cp next.config.js "$UPLOAD_DIR/" 2>/dev/null
cp tsconfig.json "$UPLOAD_DIR/" 2>/dev/null
cp tailwind.config.js "$UPLOAD_DIR/" 2>/dev/null
cp postcss.config.js "$UPLOAD_DIR/" 2>/dev/null

echo ""
echo "✅ Archivos preparados en: $UPLOAD_DIR"
echo ""
echo "📊 Resumen de archivos:"
du -sh "$UPLOAD_DIR"/* 2>/dev/null | head -10
echo ""
echo "📝 Archivos listos para subir:"
ls -la "$UPLOAD_DIR" | grep -E "^d|^-" | awk '{print $9}' | grep -v "^\.$" | grep -v "^\.\.$"
echo ""
echo "⚠️  IMPORTANTE: NO subas .env.local ni node_modules/"
echo ""
echo "🚀 Siguiente paso: Sube todos los archivos de $UPLOAD_DIR a DreamHost"

