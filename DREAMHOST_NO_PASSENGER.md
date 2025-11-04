# 🚀 Alternativas Si No Hay Opción de Passenger en el Panel

## 🔍 Situación: No encuentras Passenger/Node.js en el panel

Esto puede pasar porque:
- Passenger puede activarse automáticamente
- Puede estar en otra sección del panel
- Puede necesitar un archivo específico para activarse
- Puede requerir que contactes a soporte

---

## ✅ SOLUCIÓN 1: Passenger se activa automáticamente

En algunos planes de DreamHost, Passenger se activa automáticamente cuando detecta una aplicación Node.js.

### Verificar si ya está activo:

1. **Sube tu archivo `package.json`** (ya debería estar subido)

2. **Crea un archivo `package.json` en la raíz** (si no está):
   ```json
   {
     "name": "landing-ideapunkt",
     "version": "0.1.0",
     "scripts": {
       "start": "next start"
     },
     "dependencies": {
       "next": "^14.0.0",
       "react": "^18.2.0",
       "react-dom": "^18.2.0"
     }
   }
   ```

3. **Verifica desde SSH**:
   ```bash
   ssh tu_usuario@ideapunkt.de
   cd ~/ideapunkt.de
   
   # Ver si Passenger está corriendo
   ps aux | grep passenger
   
   # Ver si hay procesos de Node.js
   ps aux | grep node
   ```

4. **Prueba tu sitio**: Abre `https://ideapunkt.de` en el navegador
   - Si carga, Passenger ya está funcionando
   - Si da error, ve a Solución 2

---

## ✅ SOLUCIÓN 2: Crear archivo para activar Passenger

Passenger puede activarse creando ciertos archivos:

### Opción A: Crear archivo `.htaccess` (si usa Apache)

Desde SSH:
```bash
cd ~/ideapunkt.de
nano .htaccess
```

Pega esto:
```apache
PassengerEnabled on
PassengerAppRoot /home/tu_usuario/ideapunkt.de
PassengerAppType node
PassengerStartupFile package.json
```

Guarda: `Ctrl + X`, `Y`, `Enter`

### Opción B: Crear archivo `passenger_wsgi.json`

Desde SSH:
```bash
cd ~/ideapunkt.de
nano passenger_wsgi.json
```

Pega esto (ajusta la ruta):
```json
{
  "app_type": "node",
  "startup_file": "package.json",
  "app_root": "/home/tu_usuario/ideapunkt.de"
}
```

### Opción C: Verificar estructura de archivos

Asegúrate de que tienes:
```
ideapunkt.de/
├── package.json          ✅ (con script "start")
├── .next/                ✅
├── app/                  ✅
├── components/           ✅
└── node_modules/         ✅ (después de npm install)
```

---

## ✅ SOLUCIÓN 3: Buscar en Otras Secciones del Panel

### Lugares alternativos donde puede estar:

1. **Panel → Domains → Manage Domains**:
   - Haz clic en tu dominio
   - Busca tabs: **"Web Hosting"**, **"PHP Versions"**, **"Advanced"**, **"Settings"**
   - Dentro de cada tab, busca: **"Node.js"**, **"Passenger"**, **"Application Server"**

2. **Panel → Goodies → One-Click Installs**:
   - Busca si hay opción de instalar Node.js

3. **Panel → Users → Manage Users**:
   - Busca opciones de **"Shell"** o **"Application"**

4. **Panel → Files → WebFTP**:
   - A veces hay opciones de configuración ahí

---

## ✅ SOLUCIÓN 4: Contactar Soporte de DreamHost

Si ninguna de las anteriores funciona, contacta a soporte:

### Chat en vivo (Recomendado):
1. Ve al panel de DreamHost
2. Busca **"Support"** o **"Help"**
3. Inicia chat en vivo
4. Pregunta:

> "Tengo una aplicación Next.js y necesito activar Node.js/Passenger en mi servidor compartido. No veo la opción en el panel. ¿Cómo puedo activarlo?"

### Email:
- Email: support@dreamhost.com
- Asunto: "Activar Node.js/Passenger para aplicación Next.js"
- Mensaje:
  ```
  Hola,
  
  Tengo una aplicación Next.js que necesito desplegar en mi servidor compartido.
  No encuentro la opción para activar Passenger/Node.js en mi panel.
  
  Mi dominio: ideapunkt.de
  Usuario: [tu_usuario]
  
  ¿Podrían ayudarme a activar Node.js/Passenger?
  
  Gracias.
  ```

---

## ✅ SOLUCIÓN 5: Verificar si Node.js está disponible

Desde SSH:
```bash
ssh tu_usuario@ideapunkt.de
cd ~/ideapunkt.de

# Verificar Node.js
node --version

# Si no está instalado, verificar si puedes instalarlo
which node
which npm

# Verificar si hay algún proceso corriendo
ps aux | grep -i node
ps aux | grep -i passenger
```

---

## ✅ SOLUCIÓN 6: Usar Archivo de Inicio Personalizado

Si Passenger no se activa automáticamente, crea un archivo `server.js`:

Desde SSH:
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
const hostname = '0.0.0.0'
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
  }).listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

Y actualiza `package.json`:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

---

## 🔍 Verificar si Ya Está Funcionando

### Prueba esto primero:

1. **Abre tu sitio**: `https://ideapunkt.de`
   - ¿Carga la página? → Entonces ya está funcionando
   - ¿Da error 500 o 404? → Necesita configuración

2. **Ver logs**:
   ```bash
   ssh tu_usuario@ideapunkt.de
   tail -f ~/logs/ideapunkt.de/error.log
   ```
   - Abre el sitio en otra pestaña
   - Ve qué errores aparecen en los logs

3. **Ver procesos**:
   ```bash
   ps aux | grep node
   ps aux | grep passenger
   ```

---

## 📝 Checklist de Verificación

- [ ] `package.json` está en la raíz del dominio
- [ ] `package.json` tiene script `"start": "next start"`
- [ ] `node_modules/` está instalado (`npm install --production`)
- [ ] Archivo `.env` existe con las variables
- [ ] Probar el sitio en el navegador
- [ ] Revisar logs de errores
- [ ] Contactar soporte si nada funciona

---

## 🆘 Si Nada Funciona

**Contacta a soporte de DreamHost**:
- Son muy útiles y pueden activar Node.js/Passenger desde su lado
- Pueden guiarte exactamente dónde está la opción en tu panel específico
- Pueden verificar si tu plan incluye Node.js

**Pregunta específica**:
> "Tengo una aplicación Next.js lista para desplegar. He subido todos los archivos y configurado el .env, pero no encuentro dónde activar Node.js/Passenger en mi panel. ¿Pueden ayudarme a activarlo?"

