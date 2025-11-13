#!/bin/bash

# Script de diagnóstico para ejecutar en el servidor DreamHost
# Uso: Copia y pega estos comandos uno por uno en el terminal SSH

echo "🔍 DIAGNÓSTICO DEL SERVIDOR"
echo "============================"
echo ""

echo "1️⃣ Ubicación actual:"
pwd
echo ""

echo "2️⃣ Archivos en la raíz:"
ls -la
echo ""

echo "3️⃣ Verificar BUILD_ID:"
if [ -f ".next/BUILD_ID" ]; then
  echo "✅ BUILD_ID encontrado:"
  cat .next/BUILD_ID
else
  echo "❌ BUILD_ID NO encontrado"
fi
echo ""

echo "4️⃣ Verificar diagnostico.html:"
if [ -f "diagnostico.html" ]; then
  echo "✅ diagnostico.html existe"
  echo "Permisos:"
  ls -la diagnostico.html
else
  echo "❌ diagnostico.html NO existe"
fi
echo ""

echo "5️⃣ Verificar .htaccess:"
if [ -f ".htaccess" ]; then
  echo "✅ .htaccess existe"
  echo "Primeras líneas:"
  head -10 .htaccess
else
  echo "❌ .htaccess NO existe"
fi
echo ""

echo "6️⃣ Procesos de Node.js:"
ps aux | grep node | grep -v grep
if [ $? -eq 0 ]; then
  echo "✅ Node.js está corriendo"
else
  echo "❌ Node.js NO está corriendo"
fi
echo ""

echo "7️⃣ Procesos de Passenger:"
ps aux | grep passenger | grep -v grep
if [ $? -eq 0 ]; then
  echo "✅ Passenger está corriendo"
else
  echo "❌ Passenger NO está corriendo"
fi
echo ""

echo "8️⃣ Buscar logs de error:"
echo "Ubicaciones comunes:"
if [ -f ~/logs/error.log ]; then
  echo "✅ ~/logs/error.log existe"
  echo "Últimas 20 líneas:"
  tail -20 ~/logs/error.log
elif [ -f ~/logs/ideapunkt.de/error.log ]; then
  echo "✅ ~/logs/ideapunkt.de/error.log existe"
  echo "Últimas 20 líneas:"
  tail -20 ~/logs/ideapunkt.de/error.log
else
  echo "⚠️ No se encontraron logs en ubicaciones comunes"
  echo "Buscando logs..."
  find ~/logs -name "*error*" -type f 2>/dev/null | head -5
fi
echo ""

echo "9️⃣ Verificar configuración del dominio:"
echo "Buscar archivos del proyecto en diferentes ubicaciones:"
find ~ -name "diagnostico.html" 2>/dev/null
find ~ -name ".next" -type d 2>/dev/null | head -3
echo ""

echo "🔟 Verificar permisos importantes:"
if [ -f "diagnostico.html" ]; then
  ls -la diagnostico.html
fi
if [ -f ".htaccess" ]; then
  ls -la .htaccess
fi
if [ -d ".next" ]; then
  ls -ld .next
fi
echo ""

echo "✅ Diagnóstico completado"
echo ""
echo "📝 Próximos pasos:"
echo "1. Revisa los resultados arriba"
echo "2. Si ves errores en los logs, cópialos"
echo "3. Verifica que BUILD_ID sea el correcto (build-1763038018480)"
echo "4. Verifica que diagnostico.html exista y tenga permisos correctos (644)"
echo ""

