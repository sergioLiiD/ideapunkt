# 🚀 Pasos para Subir Manualmente a DreamHost

## 📋 Pre-requisitos

Antes de empezar, asegúrate de tener:
- ✅ Acceso SSH a DreamHost
- ✅ Acceso FTP/SFTP o Panel de DreamHost
- ✅ Variables de entorno de VAPI configuradas
- ✅ Build generado (✅ ya está hecho)

---

## PASO 1: Preparar archivos en tu computadora

### 1.1 Crear carpeta temporal para subir

Crea una carpeta temporal con solo los archivos necesarios:

```bash
# En tu computadora, crea una carpeta temporal
mkdir ~/ideapunkt-upload
cd ~/ideapunkt-upload
```

### 1.2 Copiar archivos necesarios

Copia estos archivos desde tu proyecto:

```bash
# Desde la carpeta del proyecto
cd /Users/sergio/Projects/landing-ideapunkt

# Copiar carpeta .next completa
cp -r .next ~/ideapunkt-upload/

# Copiar carpeta public
cp -r public ~/ideapunkt-upload/

# Copiar carpeta app
cp -r app ~/ideapunkt-upload/

# Copiar carpeta components
cp -r components ~/ideapunkt-upload/

# Copiar archivos de configuración
cp package.json ~/ideapunkt-upload/
cp package-lock.json ~/ideapunkt-upload/
cp next.config.js ~/ideapunkt-upload/
cp tsconfig.json ~/ideapunkt-upload/
cp tailwind.config.js ~/ideapunkt-upload/
cp postcss.config.js ~/ideapunkt-upload/
```

### 1.3 Verificar que tienes todo

```bash
cd ~/ideapunkt-upload
ls -la
```

Deberías ver:
- `.next/` (carpeta)
- `public/` (carpeta)
- `app/` (carpeta)
- `components/` (carpeta)
- `package.json`
- `package-lock.json`
- `next.config.js`
- `tsconfig.json`
- `tailwind.config.js`
- `postcss.config.js`

---

## PASO 2: Conectar con DreamHost

### 2.1 Obtener información de conexión

En el panel de DreamHost:
1. Ve a **Users** → **Manage Users**
2. Anota tu nombre de usuario
3. Ve a **Domains** → **Manage Domains**
4. Anota la ruta del directorio de tu dominio (ej: `/home/usuario/ideapunkt.de`)

### 2.2 Conectar por FTP/SFTP

**Opción A: Usar FileZilla o similar**
- Host: `ideapunkt.de` (o el servidor que te indique DreamHost)
- Usuario: Tu usuario de DreamHost
- Contraseña: Tu contraseña
- Puerto: 22 (SFTP) o 21 (FTP)

**Opción B: Usar el panel de DreamHost**
- Ve a **Files** → **WebFTP**
- Navega hasta el directorio de tu dominio

---

## PASO 3: Subir archivos a DreamHost

### 3.1 Conectar al directorio correcto

Asegúrate de estar en el directorio raíz de tu dominio:
```
/home/tu_usuario/ideapunkt.de/
```

O si DreamHost usa otra estructura:
```
/home/tu_usuario/ideapunkt.de/public/
```

### 3.2 Subir archivos

Sube TODOS los archivos de `~/ideapunkt-upload/`:

**IMPORTANTE**: Sube las carpetas COMPLETAS:
- `.next/` (carpeta completa con todo su contenido)
- `public/` (carpeta completa)
- `app/` (carpeta completa)
- `components/` (carpeta completa)
- Todos los archivos `.json` y `.js` de configuración

**Tiempo estimado**: 10-30 minutos dependiendo de tu conexión (143 MB de `.next/`)

---

## PASO 4: Conectar por SSH

### 4.1 Abrir terminal SSH

En el panel de DreamHost:
- Ve a **Users** → **Manage Users**
- Haz clic en **Log in** para obtener acceso SSH

O desde tu terminal:
```bash
ssh tu_usuario@ideapunkt.de
```

### 4.2 Navegar al directorio

```bash
cd ~/ideapunkt.de
# O la ruta que te indique DreamHost
```

### 4.3 Verificar que los archivos están ahí

```bash
ls -la
```

Deberías ver tus carpetas: `.next`, `public`, `app`, `components`, etc.

---

## PASO 5: Instalar dependencias

### 5.1 Instalar Node.js modules

```bash
npm install --production
```

Esto instalará todas las dependencias necesarias. Esto puede tardar 2-5 minutos.

### 5.2 Verificar instalación

```bash
npm list --depth=0
```

Deberías ver todas las dependencias instaladas.

---

## PASO 6: Configurar variables de entorno

### Opción A: Panel de DreamHost (Recomendado)

1. Ve a **Domains** → **Manage Domains**
2. Selecciona tu dominio
3. Busca la sección **"Environment Variables"** o **"Passenger ENV"**
4. Agrega estas variables:

```
NEXT_PUBLIC_VAPI_PUBLIC_KEY=tu_public_key_aqui
VAPI_API_KEY=tu_api_key_privada_aqui
NEXT_PUBLIC_VAPI_ASSISTANT_ID=tu_assistant_id_aqui
NEXT_PUBLIC_BASE_URL=https://ideapunkt.de
NODE_ENV=production
PORT=3000
```

### Opción B: Crear archivo .env (Alternativa)

Si DreamHost no tiene panel de variables de entorno:

```bash
cd ~/ideapunkt.de
nano .env
```

Pega las variables:
```
NEXT_PUBLIC_VAPI_PUBLIC_KEY=tu_public_key_aqui
VAPI_API_KEY=tu_api_key_privada_aqui
NEXT_PUBLIC_VAPI_ASSISTANT_ID=tu_assistant_id_aqui
NEXT_PUBLIC_BASE_URL=https://ideapunkt.de
NODE_ENV=production
PORT=3000
```

Guarda: `Ctrl + X`, luego `Y`, luego `Enter`

---

## PASO 7: Configurar Node.js en DreamHost

### 7.1 Activar Node.js

1. Ve a **Domains** → **Manage Domains**
2. Selecciona tu dominio
3. Busca **"Web Hosting"** o **"Passenger"**
4. Activa **"Passenger"** o **"Node.js"**
5. Configura:
   - **App Directory**: `/home/tu_usuario/ideapunkt.de`
   - **Startup File**: `server.js` (si existe) o deja vacío
   - **App Type**: `Node.js`

### 7.2 Configurar comando de inicio

Si hay opción de "Startup Command", usa:
```
npm start
```

O si no está disponible, DreamHost debería detectar automáticamente `package.json`.

---

## PASO 8: Crear archivo de inicio (si es necesario)

Si DreamHost requiere un archivo específico, crea `server.js`:

```bash
cd ~/ideapunkt.de
nano server.js
```

Pega esto:
```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

Guarda y sal: `Ctrl + X`, `Y`, `Enter`

---

## PASO 9: Verificar y probar

### 9.1 Verificar que el servidor está corriendo

```bash
# En SSH
ps aux | grep node
```

Deberías ver procesos de Node.js corriendo.

### 9.2 Verificar logs

```bash
# En SSH, busca los logs
tail -f ~/logs/ideapunkt.de/error.log
# O donde DreamHost guarde los logs
```

### 9.3 Probar en el navegador

1. Abre `https://ideapunkt.de`
2. Verifica que carga la página
3. Prueba el chatbot (modo voz y texto)
4. Verifica sitemap: `https://ideapunkt.de/sitemap.xml`
5. Verifica robots: `https://ideapunkt.de/robots.txt`

---

## PASO 10: Troubleshooting

### Si la página no carga:

1. **Verificar logs**:
   ```bash
   tail -f ~/logs/ideapunkt.de/error.log
   ```

2. **Verificar que Node.js está corriendo**:
   ```bash
   ps aux | grep node
   ```

3. **Verificar variables de entorno**:
   ```bash
   env | grep VAPI
   ```

4. **Reiniciar la aplicación**:
   - En el panel de DreamHost, desactiva y reactiva Passenger/Node.js
   - O reinicia el servidor

### Si hay errores de módulos:

```bash
cd ~/ideapunkt.de
rm -rf node_modules
npm install --production
```

### Si la API no funciona:

1. Verifica que `VAPI_API_KEY` está configurada
2. Verifica que el endpoint `/api/chat` está accesible
3. Revisa los logs para ver errores específicos

---

## ✅ Checklist Final

Antes de considerar que todo está listo:

- [ ] Archivos subidos correctamente
- [ ] `npm install --production` ejecutado sin errores
- [ ] Variables de entorno configuradas
- [ ] Node.js/Passenger activado en DreamHost
- [ ] Servidor corriendo (verificar con `ps aux | grep node`)
- [ ] Página carga en `https://ideapunkt.de`
- [ ] Chatbot funciona (modo voz)
- [ ] Chatbot funciona (modo texto)
- [ ] Sitemap accesible
- [ ] Robots.txt accesible
- [ ] SSL/HTTPS activado

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de DreamHost
2. Verifica la documentación de DreamHost sobre Node.js
3. Contacta el soporte de DreamHost si es necesario

¡Éxito con el despliegue! 🚀

