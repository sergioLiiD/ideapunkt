# 🔧 Solución: version.txt Devuelve 404 Aunque Existe

## 🔍 Problema
El archivo `version.txt` está en `public/version.txt` en el servidor, pero `https://ideapunkt.de/version.txt` devuelve 404.

## 🎯 Causas Posibles

### 1. Next.js no está corriendo
Si Next.js no está ejecutándose, no puede servir archivos de `public/`.

**Solución:**
- Verifica que Next.js está corriendo: `ps aux | grep node`
- Si no está corriendo, inicia: `npm start` o reinicia Passenger

### 2. Apache está interceptando las peticiones
Si Apache está sirviendo el sitio directamente (sin Next.js), necesita configuración para servir `public/`.

**Solución:** Actualizar `.htaccess` (ver abajo)

### 3. Problema con la ruta
Next.js sirve archivos de `public/` desde la raíz, pero puede haber conflicto con la configuración del servidor.

## ✅ Soluciones

### Solución 1: Configurar Apache para Servir Archivos de public/

Actualiza tu `.htaccess` para que Apache sirva archivos de `public/` cuando Next.js no esté disponible:

```apache
# Passenger configuration for Next.js on DreamHost
PassengerEnabled on
PassengerAppRoot /home/USUARIO/ideapunkt.de
PassengerAppType node
PassengerStartupFile package.json
PassengerNodejs /usr/bin/node

# Si Passenger no está disponible, servir archivos estáticos directamente
<IfModule !mod_passenger.c>
  # Servir archivos de public/ directamente
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/_next/
  RewriteRule ^(.*)$ public/$1 [L]
</IfModule>

# Deshabilitar caché para evitar problemas con versiones antiguas
<IfModule mod_headers.c>
  # Deshabilitar caché para HTML y páginas principales
  <FilesMatch "\.(html|htm)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
  </FilesMatch>
  
  # Permitir caché solo para archivos estáticos con hash (Next.js los maneja)
  <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>

# Forzar recarga de archivos JavaScript y CSS
<IfModule mod_expires.c>
  ExpiresActive Off
</IfModule>
```

### Solución 2: Verificar que Next.js Está Corriendo

**Por SSH:**
```bash
ssh tu_usuario@ideapunkt.de
cd ~/ideapunkt.de

# Verificar procesos de Node.js
ps aux | grep node

# Si no hay procesos, iniciar Next.js
npm start

# O reiniciar Passenger
touch tmp/restart.txt
```

### Solución 3: Crear Ruta Alternativa en Next.js

Si Next.js está corriendo pero no sirve el archivo, podemos crear una ruta API que lo sirva:

**Crear `app/api/version/route.ts`:**
```typescript
import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'version.txt')
    const content = readFileSync(filePath, 'utf-8')
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  } catch (error) {
    return new NextResponse('File not found', { status: 404 })
  }
}
```

Luego acceder a: `https://ideapunkt.de/api/version`

### Solución 4: Mover version.txt a la Raíz

Si nada funciona, mueve el archivo a la raíz del dominio:

**En el servidor:**
```bash
# Copiar archivo a la raíz
cp public/version.txt ~/ideapunkt.de/version.txt

# Verificar
cat ~/ideapunkt.de/version.txt
```

Luego debería ser accesible como: `https://ideapunkt.de/version.txt`

## 🔍 Diagnóstico

### Paso 1: Verificar que Next.js Está Corriendo

```bash
# En el servidor
ps aux | grep node
ps aux | grep passenger
```

**Si NO hay procesos:**
- Next.js no está corriendo
- Necesitas iniciarlo o configurar Passenger

### Paso 2: Verificar que el Archivo Existe

```bash
# En el servidor
ls -la public/version.txt
cat public/version.txt
```

**Si el archivo NO existe:**
- Sube el archivo de nuevo

### Paso 3: Verificar Logs

```bash
# En el servidor
tail -f ~/logs/error.log
# O
tail -f ~/logs/ideapunkt.de/error.log
```

**Luego intenta acceder a:** `https://ideapunkt.de/version.txt`
**Y observa qué errores aparecen en los logs**

### Paso 4: Probar Acceso Directo

```bash
# En el servidor, probar si Apache puede servir el archivo
curl http://localhost/public/version.txt
# O
curl http://localhost/version.txt
```

## 📋 Checklist de Verificación

- [ ] Archivo existe en `public/version.txt` en el servidor
- [ ] Next.js está corriendo (`ps aux | grep node`)
- [ ] Passenger está activo (si aplica)
- [ ] `.htaccess` está configurado correctamente
- [ ] Probé acceder a `https://ideapunkt.de/version.txt`
- [ ] Probé acceder a `https://www.ideapunkt.de/version.txt`
- [ ] Revisé los logs de error del servidor
- [ ] Verifiqué permisos del archivo (`ls -la public/version.txt`)

## 💡 Próximos Pasos

1. **Verifica si Next.js está corriendo** (más importante)
2. **Si no está corriendo**, inicia o configura Passenger
3. **Si está corriendo pero no funciona**, actualiza `.htaccess` con la Solución 1
4. **Si nada funciona**, usa la Solución 4 (mover a la raíz)

