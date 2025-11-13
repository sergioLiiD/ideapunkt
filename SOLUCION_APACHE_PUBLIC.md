# 🔧 Solución: Apache No Sirve Archivos de /public

## 🔍 Problema Identificado
- ✅ Archivo está en `public/diagnostico.html` en el servidor
- ❌ `https://ideapunkt.de/diagnostico.html` devuelve 404
- ❌ Next.js no está corriendo (por eso no sirve archivos de public/)
- ❌ Apache no está sirviendo archivos de public/ directamente

## 🎯 Causa Probable
El dominio está configurado para apuntar a la **raíz del proyecto** (`~/ideapunkt.de/`), pero:
- Next.js no está corriendo → No puede servir archivos de `public/`
- Apache no tiene configuración para servir `public/` directamente
- Los archivos en `public/` no son accesibles directamente desde la raíz

## ✅ Soluciones

### Solución 1: Mover Archivos de public/ a la Raíz (TEMPORAL para diagnóstico)

**En el servidor (File Manager o SSH):**
1. Copia `public/diagnostico.html` a la raíz: `~/ideapunkt.de/diagnostico.html`
2. Copia `public/version.txt` a la raíz: `~/ideapunkt.de/version.txt`

**Luego prueba:**
- `https://ideapunkt.de/diagnostico.html` (debe funcionar ahora)
- `https://ideapunkt.de/version.txt` (debe funcionar ahora)

**Si esto funciona:**
- Confirma que el dominio apunta a `~/ideapunkt.de/`
- Confirma que Apache puede servir archivos de la raíz
- El problema es que `public/` no se está sirviendo directamente

### Solución 2: Actualizar .htaccess para Servir public/ Directamente

Actualiza `.htaccess` para que Apache sirva archivos de `public/` cuando no los encuentra en la raíz:

```apache
# Passenger configuration for Next.js on DreamHost
PassengerEnabled on
PassengerAppRoot /home/USUARIO/ideapunkt.de
PassengerAppType node
PassengerStartupFile package.json
PassengerNodejs /usr/bin/node

# Servir archivos de public/ directamente si no se encuentran en la raíz
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Si el archivo no existe en la raíz, buscar en public/
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/_next/
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteCond %{DOCUMENT_ROOT}/public%{REQUEST_URI} -f
  RewriteRule ^(.*)$ public/$1 [L]
  
  # Si es un archivo .txt, .html, .svg, etc. en public/, servirlo directamente
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_URI} \.(txt|html|svg|jpg|png|gif|ico|json)$ [NC]
  RewriteCond %{DOCUMENT_ROOT}/public%{REQUEST_URI} -f
  RewriteRule ^(.*)$ public/$1 [L]
</IfModule>

# Deshabilitar caché COMPLETAMENTE
<IfModule mod_headers.c>
  <FilesMatch "\.(html|htm|txt)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate, max-age=0"
    Header set Pragma "no-cache"
    Header set Expires "0"
    Header unset ETag
  </FilesMatch>
</IfModule>
```

### Solución 3: Verificar Configuración del Dominio en DreamHost

**En el panel de DreamHost:**
1. Ve a **Domains** → **Manage Domains**
2. Selecciona `ideapunkt.de`
3. Verifica **"Web Directory"** o **"Document Root"**
4. Debe ser: `~/ideapunkt.de` o `/home/tu_usuario/ideapunkt.de`

**Si apunta a otra ubicación:**
- Cambia la configuración para que apunte a `~/ideapunkt.de`
- O mueve todos los archivos a la ubicación correcta

### Solución 4: Verificar si Next.js Está Corriendo

**Si tienes acceso SSH:**
```bash
ssh tu_usuario@ideapunkt.de
cd ~/ideapunkt.de

# Verificar procesos
ps aux | grep node
ps aux | grep passenger

# Si NO hay procesos, Next.js no está corriendo
# Por eso no puede servir archivos de public/
```

**Si Next.js NO está corriendo:**
- El sitio funciona porque Apache sirve HTML estático de `.next/server/app/`
- Pero los archivos de `public/` no son accesibles porque Next.js no está corriendo
- **Solución:** Inicia Next.js o configura Apache para servir `public/` directamente

## 🚀 Pasos Inmediatos

### Paso 1: Mover Archivos a la Raíz (Prueba Rápida)

**En File Manager de DreamHost:**
1. Ve a `public/diagnostico.html`
2. Cópialo a la raíz: `diagnostico.html` (fuera de la carpeta public)
3. Prueba: `https://ideapunkt.de/diagnostico.html`

**Si funciona:**
- Confirma que el dominio apunta a la ubicación correcta
- El problema es que `public/` no se está sirviendo

### Paso 2: Actualizar .htaccess

Sube el `.htaccess` actualizado (ver Solución 2 arriba) que incluye reglas para servir archivos de `public/`.

### Paso 3: Verificar Configuración del Dominio

Verifica en el panel de DreamHost a qué carpeta apunta el dominio.

## 📋 Qué Reportar

1. **¿Funciona `https://ideapunkt.de/diagnostico.html` después de copiarlo a la raíz?**
   - Sí / No

2. **¿A qué carpeta apunta el dominio en DreamHost?**
   - Verifica en el panel

3. **¿Tienes acceso SSH?**
   - Si sí, podemos verificar procesos y ubicaciones

Con esta información podré darte la solución exacta.

