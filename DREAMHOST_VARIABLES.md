# 🔧 Configurar Variables de Entorno y Comandos en DreamHost

## 📍 Dónde Ejecutar Comandos (SSH)

### Opción 1: Terminal Web en el Panel (Más Fácil)

1. **Acceder al Panel de DreamHost**:
   - Ve a https://panel.dreamhost.com
   - Inicia sesión

2. **Activar y Usar Shell**:
   - Ve a **Users** → **Manage Users**
   - Busca tu usuario
   - Haz clic en **"Log in"** o **"Enable Shell"**
   - Esto abre un terminal web en tu navegador
   - O busca **"Web Shell"** en el menú

3. **Navegar a tu dominio**:
   ```bash
   cd ~/ideapunkt.de
   # O pregunta a soporte cuál es la ruta exacta de tu dominio
   ```

### Opción 2: Terminal Local (Desde tu Mac)

1. **Abrir Terminal en tu Mac**

2. **Conectar por SSH**:
   ```bash
   ssh tu_usuario@ideapunkt.de
   ```
   O si DreamHost te da un servidor específico:
   ```bash
   ssh tu_usuario@tu_servidor.dreamhost.com
   ```

3. **Navegar a tu dominio**:
   ```bash
   cd ~/ideapunkt.de
   ```

---

## 🔐 Dónde Configurar Variables de Entorno

### Opción A: Panel de DreamHost (Recomendado)

1. **Ve a Domains**:
   - Panel → **Domains** → **Manage Domains**
   - Selecciona tu dominio (ideapunkt.de)

2. **Busca Variables de Entorno**:
   - Si usas **Passenger** (Node.js):
     - Busca la sección **"Passenger Environment Variables"**
     - O **"Environment Variables"** dentro de la configuración de Passenger
   
   - Si no ves esa opción:
     - Busca **"Web Hosting"** → **"Passenger"** o **"Node.js"**
     - Dentro de esa sección busca **"ENV"** o **"Environment"**

3. **Agregar Variables**:
   - Haz clic en **"Add"** o **"+"** o **"Add Variable"**
   - Agrega cada variable:
     ```
     NEXT_PUBLIC_VAPI_PUBLIC_KEY = tu_public_key
     VAPI_API_KEY = tu_api_key_privada
     NEXT_PUBLIC_VAPI_ASSISTANT_ID = tu_assistant_id
     NEXT_PUBLIC_BASE_URL = https://ideapunkt.de
     NODE_ENV = production
     ```

### Opción B: Archivo .env (Si el Panel no tiene opción)

1. **Conectar por SSH** (usando el método de arriba)

2. **Navegar al directorio**:
   ```bash
   cd ~/ideapunkt.de
   ```

3. **Crear archivo .env**:
   ```bash
   nano .env
   ```

4. **Agregar las variables** (sin espacios alrededor del =):
   ```
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=tu_public_key
   VAPI_API_KEY=tu_api_key_privada
   NEXT_PUBLIC_VAPI_ASSISTANT_ID=tu_assistant_id
   NEXT_PUBLIC_BASE_URL=https://ideapunkt.de
   NODE_ENV=production
   ```

5. **Guardar**:
   - `Ctrl + X`
   - `Y` para confirmar
   - `Enter` para guardar

---

## 📦 Dónde Ejecutar npm install

### Pasos Detallados:

1. **Conectar por SSH** (usando el método de arriba)

2. **Verificar que estás en el lugar correcto**:
   ```bash
   # Ver dónde estás
   pwd
   
   # Debería mostrar algo como:
   # /home/tu_usuario/ideapunkt.de
   ```

3. **Verificar que los archivos están ahí**:
   ```bash
   ls -la
   ```
   Deberías ver: `.next`, `app`, `components`, `package.json`, etc.

4. **Ejecutar npm install**:
   ```bash
   npm install --production
   ```
   
   Esto puede tardar 2-5 minutos. Verás el progreso en la terminal.

5. **Verificar que se instaló correctamente**:
   ```bash
   npm list --depth=0
   ```

---

## 🗺️ Encontrar la Ruta de Tu Dominio

### Método 1: Preguntar al Panel

1. **Panel → Domains → Manage Domains**
2. Selecciona tu dominio
3. Busca **"Document Root"** o **"Web Directory"**
4. Esa es la ruta donde debes subir tus archivos

### Método 2: Buscar desde SSH

```bash
# Conéctate por SSH primero
ssh tu_usuario@ideapunkt.de

# Buscar tu package.json
find ~ -name "package.json" 2>/dev/null

# O buscar archivos de tu dominio
find ~ -name "ideapunkt.de" -type d 2>/dev/null
```

### Método 3: Rutas Comunes de DreamHost

DreamHost típicamente usa:
```
/home/tu_usuario/ideapunkt.de/
```
O a veces:
```
/home/tu_usuario/domains/ideapunkt.de/
```

---

## 🔍 Si No Puedes Encontrar las Opciones

### Buscar en el Panel:

1. **Panel → Domains → Manage Domains**:
   - Selecciona tu dominio
   - Revisa TODAS las pestañas: **"Web Hosting"**, **"Passenger"**, **"Node.js"**, **"Settings"**, **"Advanced"**, **"DNS"**

2. **Panel → Users → Manage Users**:
   - Busca **"Shell Access"**, **"SSH"**, o **"Log in"**

3. **Contactar Soporte de DreamHost**:
   - En el panel, busca **"Support"** o **"Help"**
   - Tienen chat en vivo
   - Pregunta: *"¿Dónde configuro variables de entorno para una aplicación Node.js/Next.js?"*
   - O: *"¿Cómo accedo por SSH a mi dominio?"*

---

## 📝 Comandos Útiles para Verificar

Una vez conectado por SSH:

```bash
# Ver dónde estás
pwd

# Ver archivos en el directorio actual
ls -la

# Ver si Node.js está instalado
node --version
# Debería mostrar v18.x o superior

# Ver si npm está instalado
npm --version

# Ver variables de entorno actuales
env | grep VAPI

# Ver procesos corriendo
ps aux | grep node

# Ver logs si hay errores
tail -f ~/logs/ideapunkt.de/error.log
```

---

## ⚠️ Notas Importantes

1. **Si Node.js no está instalado**: DreamHost puede requerir que lo instales manualmente. Contacta soporte.

2. **Permisos**: Asegúrate de tener permisos de escritura:
   ```bash
   chmod -R 755 ~/ideapunkt.de
   ```

3. **Ruta exacta**: Si no estás seguro de la ruta, pregunta a soporte de DreamHost. Cada cuenta puede tener una estructura ligeramente diferente.

---

## 🆘 Si Necesitas Ayuda

**Contacta a DreamHost**:
- **Chat en vivo**: Disponible en el panel de DreamHost
- **Email**: support@dreamhost.com
- **Teléfono**: Disponible en el panel

**Pregunta específica**: *"Tengo una aplicación Next.js y necesito: 1) Configurar variables de entorno, 2) Ejecutar npm install. ¿Dónde puedo hacer esto en mi panel?"*

