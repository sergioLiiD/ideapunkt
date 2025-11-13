# 🔍 Diagnóstico del Problema de Caché

## Situación Actual
- ✅ Build generado con BUILD_ID: `build-1763037971591`
- ✅ Archivos subidos al servidor
- ❌ Sigue mostrando versión anterior

## 🚨 Pasos de Diagnóstico INMEDIATOS

### Paso 1: Verificar en el Servidor (SSH)

**Conéctate por SSH a DreamHost:**
```bash
ssh tu_usuario@ideapunkt.de
cd ~/ideapunkt.de
```

**Ejecuta el script de verificación:**
```bash
# Sube el archivo verificar-servidor.sh al servidor primero
chmod +x verificar-servidor.sh
./verificar-servidor.sh
```

**O verifica manualmente:**
```bash
# 1. Verificar BUILD_ID
cat .next/BUILD_ID
# Debería mostrar: build-1763037971591

# 2. Verificar que existe la carpeta .next
ls -la .next/

# 3. Verificar tamaño (debe ser varios MB)
du -sh .next/

# 4. Verificar archivo de versión
cat public/version.txt
# Debería mostrar: BUILD_ID: build-1763037971591
```

### Paso 2: Reiniciar Passenger (MUY IMPORTANTE)

**En el servidor, ejecuta:**
```bash
# Crear o actualizar el archivo de reinicio
touch tmp/restart.txt

# Si no existe tmp/, créalo
mkdir -p tmp
touch tmp/restart.txt

# Verificar que se creó
ls -la tmp/restart.txt

# Espera 30-60 segundos para que Passenger reinicie
```

**⚠️ CRÍTICO**: Passenger NO se reinicia automáticamente. Debes hacerlo manualmente después de cada despliegue.

### Paso 3: Verificar en el Navegador

**1. Abre el archivo de versión:**
```
https://ideapunkt.de/version.txt
```
- ✅ Si ves `BUILD_ID: build-1763037971591` → Los archivos están correctos
- ❌ Si ves otro BUILD_ID o error → Los archivos no se subieron correctamente

**2. Verifica el BUILD_ID en la página:**
- Abre `https://ideapunkt.de`
- Deberías ver en la página: `v2.0 - build-1763037971591` (pequeño, abajo del título)
- Si NO lo ves → El HTML no se actualizó

**3. Verifica los archivos JavaScript:**
- Abre las herramientas de desarrollador (F12)
- Ve a la pestaña **Network**
- Marca **"Disable cache"**
- Recarga la página (F5)
- Busca archivos `.js` en la lista
- Verifica que las URLs contienen el nuevo BUILD_ID
- Ejemplo: `/_next/static/chunks/main-build-1763037971591.js`

**4. Verifica los headers HTTP:**
- En la pestaña Network, selecciona el documento principal (HTML)
- Ve a la pestaña **Headers**
- Busca `Cache-Control`
- Debería mostrar: `no-cache, no-store, must-revalidate`

### Paso 4: Limpiar Caché del Navegador

**Método 1: Recarga forzada**
- `Ctrl+Shift+R` (Windows/Linux)
- `Cmd+Shift+R` (Mac)

**Método 2: Modo incógnito**
- Abre una ventana de incógnito
- Visita `https://ideapunkt.de`
- Esto evita cualquier caché del navegador

**Método 3: Limpiar caché manualmente**
- Chrome: Configuración → Privacidad → Borrar datos de navegación
- Firefox: Configuración → Privacidad → Limpiar datos
- Safari: Desarrollo → Vaciar cachés

### Paso 5: Verificar CDN o Proxy

**Si usas Cloudflare u otro CDN:**
1. Entra al panel de Cloudflare
2. Ve a **Caché** → **Purge Everything**
3. Espera 1-2 minutos
4. Recarga la página

**Verificar si hay proxy:**
```bash
# Desde tu máquina local
curl -I https://ideapunkt.de
```

Busca headers como:
- `CF-Cache-Status` (Cloudflare)
- `X-Cache` (otros proxies)
- `Via` (proxy)

## 🔧 Soluciones por Problema

### Problema 1: BUILD_ID incorrecto en el servidor

**Síntoma:** `cat .next/BUILD_ID` muestra un BUILD_ID diferente

**Solución:**
```bash
# En el servidor
# 1. Borra TODO
rm -rf .next
rm -rf node_modules
rm -rf public

# 2. Sube de nuevo TODOS los archivos desde tu máquina local
# Especialmente:
# - .next/ (carpeta completa)
# - public/ (carpeta completa)
# - next.config.js
# - .htaccess

# 3. Verifica
cat .next/BUILD_ID
```

### Problema 2: BUILD_ID correcto pero versión antigua

**Síntoma:** BUILD_ID es correcto pero ves versión antigua

**Solución:**
```bash
# En el servidor
# 1. Reinicia Passenger
touch tmp/restart.txt

# 2. Espera 30-60 segundos

# 3. Verifica que el proceso se reinició
# (Passenger debería mostrar un nuevo PID)

# 4. En el navegador:
# - Abre modo incógnito
# - Visita https://ideapunkt.de
# - Presiona Ctrl+Shift+R
```

### Problema 3: Archivos no se suben correctamente

**Síntoma:** Los archivos parecen subirse pero no están en el servidor

**Solución:**
1. **Verifica permisos:**
   ```bash
   # En el servidor
   ls -la .next/
   # Debe mostrar permisos correctos (rwx para el usuario)
   ```

2. **Verifica que subiste la carpeta completa:**
   ```bash
   # En el servidor
   find .next -name "BUILD_ID"
   # Debe encontrar el archivo
   ```

3. **Sube manualmente los archivos críticos:**
   - `.next/BUILD_ID`
   - `.next/server/`
   - `.next/static/`
   - `public/version.txt`

### Problema 4: Passenger no se reinicia

**Síntoma:** Cambias `tmp/restart.txt` pero no pasa nada

**Solución:**
```bash
# En el servidor
# 1. Verifica que Passenger está activo
ps aux | grep passenger

# 2. Reinicia manualmente (si es posible)
# En el panel de DreamHost:
# - Ve a "Manage Domains"
# - Desactiva y reactiva Node.js/Passenger

# 3. O reinicia el servidor web completo
# (Contacta soporte de DreamHost si es necesario)
```

## 📋 Checklist de Verificación

Antes de reportar que no funciona, verifica:

- [ ] BUILD_ID en servidor es `build-1763037971591`
- [ ] Carpeta `.next/` existe y tiene contenido
- [ ] Archivo `public/version.txt` existe y es correcto
- [ ] `tmp/restart.txt` fue actualizado (touched)
- [ ] Esperaste 30-60 segundos después del reinicio
- [ ] Probaste en modo incógnito
- [ ] Presionaste Ctrl+Shift+R (recarga forzada)
- [ ] Verificaste `https://ideapunkt.de/version.txt` en el navegador
- [ ] Verificaste que los archivos JS tienen el nuevo BUILD_ID
- [ ] Verificaste headers HTTP (Cache-Control)

## 🆘 Si NADA Funciona

1. **Verifica logs del servidor:**
   ```bash
   # En el servidor
   tail -f ~/logs/error.log
   # O donde DreamHost guarde los logs
   ```

2. **Verifica variables de entorno:**
   ```bash
   # En el servidor
   env | grep NEXT
   ```

3. **Prueba ejecutar Next.js manualmente:**
   ```bash
   # En el servidor
   npm start
   # Visita el puerto que muestre
   ```

4. **Contacta soporte de DreamHost:**
   - Menciona que usas Passenger con Next.js
   - Pregunta sobre caché del servidor
   - Pregunta sobre reinicio de Passenger

## 💡 Próximos Pasos

1. **Ejecuta el diagnóstico en el servidor:**
   ```bash
   ssh tu_usuario@ideapunkt.de
   cd ~/ideapunkt.de
   ./verificar-servidor.sh
   ```

2. **Comparte los resultados** para identificar el problema específico

3. **Reinicia Passenger:**
   ```bash
   touch tmp/restart.txt
   ```

4. **Verifica en el navegador:**
   - Visita `https://ideapunkt.de/version.txt`
   - Debe mostrar el BUILD_ID correcto

