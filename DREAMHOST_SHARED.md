# 🚀 Guía para Servidor Compartido de DreamHost

## 📋 Diferencias en Servidor Compartido

En servidores compartidos de DreamHost:
- ✅ Puedes usar Node.js con Passenger
- ✅ Puedes acceder por SSH
- ✅ Puedes configurar variables de entorno
- ⚠️ Algunas rutas pueden ser diferentes
- ⚠️ Puede haber limitaciones de Node.js version

---

## 🔑 PASO 1: Habilitar Acceso SSH

### En el Panel de DreamHost:

1. **Ve a Users → Manage Users**
2. Busca tu usuario
3. Verifica que **"Shell Access"** esté activado
   - Si dice **"Disabled"**, haz clic en **"Enable"**
   - Si dice **"Enabled"**, ya está listo

4. **Obtener información de conexión**:
   - El panel te mostrará el servidor SSH
   - Puede ser algo como: `ssh.us.dreamhost.com`
   - O directamente: `ideapunkt.de`

---

## 🌐 PASO 2: Encontrar la Ruta de Tu Dominio

### Método 1: Desde el Panel

1. **Panel → Domains → Manage Domains**
2. Selecciona `ideapunkt.de`
3. Busca **"Document Root"** o **"Web Directory"**
4. Anota la ruta completa (ej: `/home/tu_usuario/ideapunkt.de`)

### Método 2: Desde SSH

```bash
# Conectar por SSH
ssh tu_usuario@ideapunkt.de
# O si te dan un servidor específico:
ssh tu_usuario@ssh.us.dreamhost.com

# Una vez conectado, buscar tu dominio
find ~ -name "ideapunkt.de" -type d 2>/dev/null

# O buscar package.json si ya lo subiste
find ~ -name "package.json" 2>/dev/null | grep ideapunkt
```

**Rutas comunes en servidores compartidos**:
```
/home/tu_usuario/ideapunkt.de/
/home/tu_usuario/ideapunkt.de/public/
/home/tu_usuario/domains/ideapunkt.de/
```

---

## 📦 PASO 3: Subir Archivos por FTP/SFTP

### Opción A: FileZilla (Recomendado)

1. **Descarga FileZilla** (gratis): https://filezilla-project.org

2. **Conectar**:
   - Host: `ideapunkt.de` o el servidor que te dio DreamHost
   - Usuario: Tu usuario de DreamHost
   - Contraseña: Tu contraseña
   - Puerto: `22` (SFTP) o `21` (FTP)

3. **Navegar a la ruta de tu dominio** (la que encontraste en el Paso 2)

4. **Subir archivos**:
   - Arrastra y suelta desde `~/ideapunkt-upload/` a DreamHost
   - Sube TODAS las carpetas: `.next`, `public`, `app`, `components`
   - Sube todos los archivos `.json` y `.js`

### Opción B: WebFTP del Panel

1. **Panel → Files → WebFTP**
2. Navega hasta tu dominio
3. Sube los archivos (puede ser más lento)

---

## 💻 PASO 4: Conectar por SSH y Ejecutar npm install

### 4.1 Conectar por SSH

**Opción A: Terminal del Panel**:
- Panel → Users → Manage Users → Haz clic en **"Log in"**
- Se abre un terminal web

**Opción B: Terminal Local**:
```bash
ssh tu_usuario@ideapunkt.de
# O
ssh tu_usuario@ssh.us.dreamhost.com
```

### 4.2 Navegar al directorio

```bash
# Reemplaza con la ruta exacta que encontraste
cd ~/ideapunkt.de

# Verificar que estás en el lugar correcto
pwd
ls -la
# Deberías ver: .next, app, components, package.json, etc.
```

### 4.3 Verificar Node.js y npm

```bash
# Verificar Node.js
node --version
# Necesitas v18 o superior

# Verificar npm
npm --version

# Si NO están instalados:
# Contacta a soporte de DreamHost para que los instalen
# O sigue la guía: https://help.dreamhost.com/hc/es/articles/360029083351
```

### 4.4 Ejecutar npm install

```bash
# Instalar dependencias de producción
npm install --production

# Esto puede tardar 2-5 minutos
# Verás el progreso en la terminal
```

### 4.5 Verificar instalación

```bash
npm list --depth=0
# Deberías ver todas tus dependencias
```

---

## 🔐 PASO 5: Configurar Variables de Entorno

### Opción A: Panel de DreamHost (Recomendado)

1. **Panel → Domains → Manage Domains**
2. Selecciona `ideapunkt.de`
3. Busca **"Web Hosting"** o **"Passenger"**
4. Dentro de esa sección, busca:
   - **"Environment Variables"**
   - **"Passenger ENV"**
   - **"ENV Variables"**
   - **"Custom Environment Variables"**

5. **Agregar variables**:
   - Haz clic en **"Add"** o **"+"**
   - Agrega cada una:
     ```
     Variable: NEXT_PUBLIC_VAPI_PUBLIC_KEY
     Value: tu_public_key_aqui
     
     Variable: VAPI_API_KEY
     Value: tu_api_key_privada_aqui
     
     Variable: NEXT_PUBLIC_VAPI_ASSISTANT_ID
     Value: tu_assistant_id_aqui
     
     Variable: NEXT_PUBLIC_BASE_URL
     Value: https://ideapunkt.de
     
     Variable: NODE_ENV
     Value: production
     ```

### Opción B: Archivo .env (Si no hay opción en el panel)

```bash
# Desde SSH
cd ~/ideapunkt.de
nano .env
```

Pega esto (sin espacios alrededor del =):
```
NEXT_PUBLIC_VAPI_PUBLIC_KEY=tu_public_key_aqui
VAPI_API_KEY=tu_api_key_privada_aqui
NEXT_PUBLIC_VAPI_ASSISTANT_ID=tu_assistant_id_aqui
NEXT_PUBLIC_BASE_URL=https://ideapunkt.de
NODE_ENV=production
```

Guardar: `Ctrl + X`, luego `Y`, luego `Enter`

---

## ⚙️ PASO 6: Configurar Node.js/Passenger

### 6.1 Activar Passenger para Node.js

1. **Panel → Domains → Manage Domains**
2. Selecciona `ideapunkt.de`
3. Busca **"Web Hosting"**
4. Activa **"Passenger"** o **"Node.js"**
5. Configura:
   - **App Directory**: `/home/tu_usuario/ideapunkt.de`
   - **Startup File**: (déjalo vacío o pon `server.js` si creaste uno)
   - **App Type**: `Node.js`

### 6.2 Verificar que Passenger está activo

```bash
# Desde SSH
cd ~/ideapunkt.de
ls -la

# Deberías ver un archivo .htaccess o similar
# Passenger debería iniciar automáticamente cuando detecte package.json
```

---

## 🔍 PASO 7: Verificar y Probar

### 7.1 Verificar que el servidor está corriendo

```bash
# Desde SSH
ps aux | grep node
# Deberías ver procesos de Node.js
```

### 7.2 Ver logs

```bash
# Ver logs de errores
tail -f ~/logs/ideapunkt.de/error.log

# O si Passenger tiene logs propios
tail -f ~/logs/ideapunkt.de/passenger.log
```

### 7.3 Probar en el navegador

1. Abre `https://ideapunkt.de`
2. Verifica que carga
3. Prueba el chatbot
4. Verifica sitemap: `https://ideapunkt.de/sitemap.xml`

---

## 🐛 Troubleshooting Específico para Servidor Compartido

### Error: "Node.js not found"

**Solución**: 
- Contacta a soporte de DreamHost
- O instala Node.js manualmente usando NVM:
  ```bash
  # Seguir guía: https://help.dreamhost.com/hc/es/articles/360029083351
  ```

### Error: "Permission denied"

**Solución**:
```bash
cd ~/ideapunkt.de
chmod -R 755 .
chmod -R 755 .next
```

### Error: "Cannot find module"

**Solución**:
```bash
cd ~/ideapunkt.de
rm -rf node_modules
npm install --production
```

### Error: Variables de entorno no funcionan

**Solución**:
1. Verifica que las variables están en el panel de DreamHost
2. O verifica que el archivo `.env` existe:
   ```bash
   ls -la .env
   cat .env
   ```
3. Reinicia Passenger (desactiva y reactiva en el panel)

### Error: "Port already in use"

**Solución**: 
- En servidores compartidos, Passenger maneja el puerto automáticamente
- No necesitas configurar puerto manualmente
- Si persiste, contacta soporte

---

## 📞 Contactar Soporte de DreamHost

Si tienes problemas, contacta a soporte:

**Pregunta específica para servidor compartido**:
> "Tengo una aplicación Next.js en servidor compartido. Necesito:
> 1. Configurar variables de entorno para Node.js
> 2. Ejecutar npm install
> 3. Activar Passenger para que la aplicación funcione
> 
> ¿Dónde puedo hacer esto en mi panel de servidor compartido?"

**Canales de soporte**:
- **Chat en vivo**: Disponible en el panel
- **Email**: support@dreamhost.com
- **Teléfono**: Disponible en el panel

---

## ✅ Checklist para Servidor Compartido

- [ ] SSH habilitado en el panel
- [ ] Ruta del dominio identificada
- [ ] Archivos subidos por FTP/SFTP
- [ ] Conectado por SSH
- [ ] Node.js y npm instalados y funcionando
- [ ] `npm install --production` ejecutado exitosamente
- [ ] Variables de entorno configuradas (panel o .env)
- [ ] Passenger/Node.js activado en el panel
- [ ] Servidor corriendo (verificar con `ps aux | grep node`)
- [ ] Sitio accesible en `https://ideapunkt.de`
- [ ] Chatbot funciona
- [ ] Sin errores en los logs

---

## 💡 Tips Específicos para Servidor Compartido

1. **No uses `npm start` manualmente**: Passenger lo maneja automáticamente
2. **Puerto**: No necesitas configurar puerto, Passenger lo asigna
3. **Reinicio**: Para reiniciar, desactiva y reactiva Passenger en el panel
4. **Logs**: Siempre revisa los logs si hay problemas
5. **Soporte**: DreamHost tiene excelente soporte, úsalo si necesitas ayuda

