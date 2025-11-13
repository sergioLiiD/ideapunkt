#!/bin/bash

# Script de diagnóstico completo para DreamHost
# Ejecutar en el servidor después de conectarse por SSH

echo "=========================================="
echo "🔍 DIAGNÓSTICO COMPLETO - Ideapunkt"
echo "=========================================="
echo ""

# 1. Ubicación actual
echo "📍 1. Ubicación actual:"
pwd
echo ""

# 2. Archivos en la raíz
echo "📁 2. Archivos en la raíz (primeros 20):"
ls -la | head -20
echo ""

# 3. BUILD_ID
echo "🏷️  3. BUILD_ID:"
if [ -f ".next/BUILD_ID" ]; then
  cat .next/BUILD_ID
else
  echo "   ❌ No existe .next/BUILD_ID"
fi
echo ""

# 4. Procesos de Node.js
echo "🟢 4. Procesos de Node.js:"
NODE_PROCESSES=$(ps aux | grep node | grep -v grep)
if [ -z "$NODE_PROCESSES" ]; then
  echo "   ❌ No hay procesos de Node.js corriendo"
else
  echo "$NODE_PROCESSES"
fi
echo ""

# 5. Procesos de Passenger
echo "🚂 5. Procesos de Passenger:"
PASSENGER_PROCESSES=$(ps aux | grep passenger | grep -v grep)
if [ -z "$PASSENGER_PROCESSES" ]; then
  echo "   ❌ No hay procesos de Passenger corriendo"
else
  echo "$PASSENGER_PROCESSES"
fi
echo ""

# 6. Archivo diagnostico.html
echo "📄 6. Archivo diagnostico.html:"
if [ -f "diagnostico.html" ]; then
  echo "   ✅ Existe en la raíz"
  ls -la diagnostico.html
else
  echo "   ❌ No existe diagnostico.html en la raíz"
fi

if [ -f "public/diagnostico.html" ]; then
  echo "   ✅ Existe en public/"
  ls -la public/diagnostico.html
else
  echo "   ❌ No existe diagnostico.html en public/"
fi
echo ""

# 7. Verificar .htaccess
echo "⚙️  7. Archivo .htaccess:"
if [ -f ".htaccess" ]; then
  echo "   ✅ Existe .htaccess"
  echo "   Tamaño: $(wc -l < .htaccess) líneas"
else
  echo "   ❌ No existe .htaccess"
fi
echo ""

# 8. Verificar estructura de carpetas
echo "📂 8. Estructura de carpetas importantes:"
for dir in ".next" "app" "components" "public"; do
  if [ -d "$dir" ]; then
    echo "   ✅ $dir/ existe"
  else
    echo "   ❌ $dir/ NO existe"
  fi
done
echo ""

# 9. Últimos errores del log
echo "📋 9. Últimos errores del log (últimas 15 líneas):"
if [ -f ~/logs/error.log ]; then
  tail -15 ~/logs/error.log
elif [ -f ~/logs/ideapunkt.de/error.log ]; then
  tail -15 ~/logs/ideapunkt.de/error.log
else
  echo "   ⚠️  No se pudo encontrar el archivo de log"
  echo "   Buscando logs en ~/logs/:"
  find ~/logs -name "*.log" -type f 2>/dev/null | head -5
fi
echo ""

# 10. Verificar permisos
echo "🔐 10. Permisos de archivos importantes:"
for file in "diagnostico.html" ".htaccess" ".next/BUILD_ID"; do
  if [ -f "$file" ]; then
    echo "   $file: $(ls -l "$file" | awk '{print $1, $3, $4}')"
  fi
done
echo ""

# 11. Verificar variables de entorno
echo "🌍 11. Variables de entorno:"
env | grep -E "NODE|NEXT|PASSENGER" | head -10 || echo "   No se encontraron variables relevantes"
echo ""

# 12. Verificar configuración del dominio
echo "🌐 12. Información del sistema:"
echo "   Usuario: $(whoami)"
echo "   Hostname: $(hostname)"
echo "   Fecha: $(date)"
echo ""

echo "=========================================="
echo "✅ DIAGNÓSTICO COMPLETADO"
echo "=========================================="
echo ""
echo "📝 Próximos pasos:"
echo "   1. Revisa los resultados arriba"
echo "   2. Si Next.js no está corriendo, ejecuta: npm start"
echo "   3. Si hay errores en los logs, compártelos"
echo "   4. Verifica que los archivos están en la ubicación correcta"
echo ""

