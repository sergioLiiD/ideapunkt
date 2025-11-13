# 🔐 Conectar por SSH a DreamHost - Paso a Paso

## 🎯 Objetivo
Conectarte por SSH para ver los logs y diagnosticar el problema de caché.

## 📋 Método 1: Terminal en tu Mac (MÁS FÁCIL)

### Paso 1: Abrir Terminal
- Presiona `Cmd + Espacio`
- Escribe "Terminal"
- Presiona Enter

### Paso 2: Obtener Información de Conexión

**En el panel de DreamHost:**
1. Ve a **Users** → **Manage Users**
2. Busca tu usuario
3. Verifica que **"Shell Access"** esté activado
4. Anota:
   - Tu **nombre de usuario**
   - El **servidor SSH** (puede ser `ideapunkt.de` o algo como `ssh.us.dreamhost.com`)

### Paso 3: Conectar por SSH

**En la Terminal, escribe:**
```bash
ssh tu_usuario@ideapunkt.de
```

**O si DreamHost te dio un servidor específico:**
```bash
ssh tu_usuario@ssh.us.dreamhost.com
```

**Reemplaza:**
- `tu_usuario` = Tu nombre de usuario de DreamHost
- `ideapunkt.de` = Tu dominio o el servidor que te dio DreamHost

### Paso 4: Ingresar Contraseña

Te pedirá la contraseña. **Escribe tu contraseña de DreamHost** (no verás lo que escribes, es normal).

### Paso 5: Navegar a tu Dominio

Una vez conectado, escribe:
```bash
cd ~/ideapunkt.de
```

O si está en otra ubicación:
```bash
cd ~/domains/ideapunkt.de
```

### Paso 6: Ver Logs de Error

```bash
# Ver los últimos errores
tail -50 ~/logs/error.log

# O si hay una carpeta específica para tu dominio
tail -50 ~/logs/ideapunkt.de/error.log

# O buscar logs en diferentes ubicaciones
find ~/logs -name "*error*" -type f 2>/dev/null
```

### Paso 7: Ver Procesos de Node.js

```bash
# Ver si Next.js está corriendo
ps aux | grep node

# Ver si Passenger está corriendo
ps aux | grep passenger
```

### Paso 8: Verificar Archivos

```bash
# Ver qué archivos hay en la raíz
ls -la

# Verificar que diagnostico.html existe
ls -la diagnostico.html

# Ver el contenido del BUILD_ID
cat .next/BUILD_ID

# Verificar permisos
ls -la diagnostico.html
```

---

## 📋 Método 2: Terminal Web en el Panel (SIN TERMINAL LOCAL)

### Paso 1: Acceder al Terminal Web

1. Ve al **panel de DreamHost**: https://panel.dreamhost.com
2. Inicia sesión
3. Ve a **Users** → **Manage Users**
4. Busca tu usuario
5. Haz clic en **"Log in"** o busca **"Web Shell"** en el menú
6. Se abrirá un terminal web en tu navegador

### Paso 2: Navegar y Ejecutar Comandos

Una vez en el terminal web, ejecuta los mismos comandos del Método 1 (pasos 5-8).

---

## 🔍 Comandos Útiles para Diagnosticar

### Ver Logs de Error en Tiempo Real
```bash
# Ver errores mientras intentas acceder al sitio
tail -f ~/logs/error.log
```

Luego, en otra pestaña del navegador, intenta acceder a:
- `https://ideapunkt.de/diagnostico.html`
- `https://ideapunkt.de`

Y observa qué errores aparecen en el terminal.

### Verificar Ubicación del Dominio
```bash
# Ver dónde estás
pwd

# Buscar archivos de tu proyecto
find ~ -name "diagnostico.html" 2>/dev/null
find ~ -name ".next" -type d 2>/dev/null
```

### Verificar Permisos
```bash
# Ver permisos de archivos
ls -la diagnostico.html
ls -la .htaccess

# Cambiar permisos si es necesario (ejemplo)
chmod 644 diagnostico.html
```

### Verificar Procesos
```bash
# Ver todos los procesos de Node.js
ps aux | grep node

# Ver procesos de Passenger
ps aux | grep passenger

# Ver procesos relacionados con tu dominio
ps aux | grep ideapunkt
```

### Verificar Configuración
```bash
# Ver el contenido de .htaccess
cat .htaccess

# Ver el BUILD_ID
cat .next/BUILD_ID

# Ver el contenido de diagnostico.html
cat diagnostico.html
```

---

## 🚨 Si No Puedes Conectarte

### Problema: "Permission denied"
- Verifica que "Shell Access" esté activado en el panel
- Verifica que estés usando el usuario y contraseña correctos

### Problema: "Connection refused"
- Verifica que estés usando el servidor SSH correcto
- Puede ser `ideapunkt.de` o `ssh.us.dreamhost.com`

### Problema: No encuentras los logs
```bash
# Buscar logs en diferentes ubicaciones
find ~ -name "*.log" -type f 2>/dev/null | head -20

# O buscar en ubicaciones comunes
ls -la ~/logs/
ls -la ~/logs/ideapunkt.de/
ls -la /var/log/
```

---

## 📝 Qué Hacer Después de Conectarte

1. **Ejecuta estos comandos y comparte los resultados:**
   ```bash
   # 1. Ver dónde estás
   pwd
   
   # 2. Ver archivos en la raíz
   ls -la
   
   # 3. Verificar BUILD_ID
   cat .next/BUILD_ID
   
   # 4. Ver procesos de Node.js
   ps aux | grep node
   
   # 5. Ver los últimos errores
   tail -50 ~/logs/error.log
   ```

2. **Intenta acceder a `diagnostico.html` mientras ves los logs:**
   ```bash
   # En el terminal SSH
   tail -f ~/logs/error.log
   
   # Luego, en tu navegador, intenta acceder a:
   # https://ideapunkt.de/diagnostico.html
   ```

3. **Comparte los resultados** para que pueda ayudarte a diagnosticar el problema.

---

## 💡 Consejo

Si es la primera vez que usas SSH, el Método 2 (Terminal Web en el Panel) es más fácil porque no necesitas instalar nada.

¡Avísame cuando te conectes y qué ves en los logs!

