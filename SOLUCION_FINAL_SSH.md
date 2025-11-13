# 🎯 Solución Final - Problemas Identificados

## 🔍 Problemas Encontrados

1. ❌ **`node_modules` NO existe** → Next.js no puede correr sin dependencias
2. ❌ **PassengerAppRoot incorrecto** → Dice `/home/USUARIO/ideapunkt.de` pero debe ser `/home/ideapunkt_admin/ideapunkt.de`
3. ❌ **Node.js NO está corriendo** → Porque no hay `node_modules`

## ✅ Solución: Pasos a Ejecutar en SSH

### Paso 1: Corregir .htaccess

El `.htaccess` tiene la ruta incorrecta. He actualizado el archivo localmente, pero también puedes corregirlo directamente en el servidor:

**En SSH, ejecuta:**
```bash
sed -i 's|/home/USUARIO/ideapunkt.de|/home/ideapunkt_admin/ideapunkt.de|g' .htaccess
```

**Verifica que se corrigió:**
```bash
grep PassengerAppRoot .htaccess
```

Debe mostrar: `PassengerAppRoot /home/ideapunkt_admin/ideapunkt.de`

### Paso 2: Instalar Dependencias (MUY IMPORTANTE)

**En SSH, ejecuta:**
```bash
npm install --production
```

Esto puede tardar 2-5 minutos. Verás el progreso en la terminal.

**Verifica que se instaló:**
```bash
ls -la node_modules | head -10
```

### Paso 3: Crear Carpeta tmp y Reiniciar Passenger

**En SSH, ejecuta:**
```bash
mkdir -p tmp
touch tmp/restart.txt
```

**Verifica que se creó:**
```bash
ls -la tmp/restart.txt
```

### Paso 4: Verificar que Node.js Está Corriendo

**Espera 30-60 segundos** y luego ejecuta:
```bash
ps aux | grep node | grep -v grep
```

**Si ves procesos de Node.js:**
- ✅ Next.js está corriendo
- El sitio debería funcionar ahora

**Si NO ves procesos:**
- Verifica los logs (ver abajo)
- O reinicia manualmente (ver abajo)

### Paso 5: Verificar Logs (si hay problemas)

**Buscar logs de Passenger:**
```bash
find ~ -name "*passenger*" -type f 2>/dev/null | head -5
find ~ -name "*error*" -type f 2>/dev/null | head -5
```

**O ver logs del sistema:**
```bash
tail -50 /var/log/apache2/error.log 2>/dev/null || tail -50 /var/log/httpd/error_log 2>/dev/null
```

## 🚨 Si npm install Falla

### Problema: "npm: command not found"

**Solución:**
```bash
# Verificar si Node.js está instalado
which node
which npm

# Si no está, puede que necesites usar la ruta completa
/usr/bin/node --version
/usr/bin/npm --version
```

### Problema: "Permission denied"

**Solución:**
```bash
# Verificar permisos
ls -la package.json
chmod 644 package.json
```

## 📋 Checklist de Verificación

Después de ejecutar los pasos, verifica:

- [ ] `.htaccess` tiene la ruta correcta (`/home/ideapunkt_admin/ideapunkt.de`)
- [ ] `node_modules` existe (ejecutaste `npm install`)
- [ ] `tmp/restart.txt` existe
- [ ] Hay procesos de Node.js corriendo (`ps aux | grep node`)
- [ ] El sitio carga correctamente

## 💡 Próximos Pasos

1. **Ejecuta los pasos 1-4** en orden
2. **Espera 1-2 minutos** después de crear `tmp/restart.txt`
3. **Verifica que Node.js está corriendo** (paso 4)
4. **Prueba el sitio** en el navegador:
   - `https://ideapunkt.de`
   - `https://ideapunkt.de/api/version`
   - `https://ideapunkt.de/diagnostico.html`

## 🎯 Resumen del Problema

**El problema era:**
- Next.js no podía correr porque no había `node_modules`
- Passenger no podía iniciar Next.js sin las dependencias
- Por eso veías versión antigua (Apache servía HTML estático cacheado)

**La solución es:**
- Instalar `node_modules` con `npm install --production`
- Corregir la ruta en `.htaccess`
- Reiniciar Passenger con `touch tmp/restart.txt`

¡Ejecuta estos pasos y el problema debería resolverse!

