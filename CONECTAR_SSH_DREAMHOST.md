# 🔌 Cómo Conectarse por SSH a DreamHost

## 📋 Paso 1: Obtener Información de Conexión

### Opción A: Desde el Panel de DreamHost (Más Fácil)

1. **Ve al panel de DreamHost:**
   - https://panel.dreamhost.com
   - Inicia sesión

2. **Ve a Users → Manage Users:**
   - Busca tu usuario
   - Verifica que **"Shell Access"** esté activado
   - Si dice "Disabled", haz clic en "Enable"

3. **Obtén la información de conexión:**
   - El panel te mostrará el servidor SSH
   - Puede ser algo como: `ssh.us.dreamhost.com` o `ideapunkt.de`
   - Anota tu nombre de usuario

### Opción B: Desde tu Mac (Terminal)

1. **Abre Terminal en tu Mac:**
   - Presiona `Cmd + Espacio`
   - Escribe "Terminal"
   - Presiona Enter

2. **Conéctate por SSH:**
   ```bash
   ssh tu_usuario@ideapunkt.de
   ```
   
   O si DreamHost te dio un servidor específico:
   ```bash
   ssh tu_usuario@ssh.us.dreamhost.com
   ```

3. **Ingresa tu contraseña:**
   - Te pedirá la contraseña de tu cuenta de DreamHost
   - Al escribir la contraseña, NO verás los caracteres (es normal)
   - Presiona Enter después de escribirla

4. **Si es la primera vez:**
   - Te preguntará si quieres continuar conectando
   - Escribe `yes` y presiona Enter

## 📋 Paso 2: Navegar a tu Dominio

Una vez conectado, navega a la carpeta de tu dominio:

```bash
cd ~/ideapunkt.de
```

O si está en otra ubicación:
```bash
cd ~/domains/ideapunkt.de
```

**Para verificar dónde estás:**
```bash
pwd
```

**Para ver qué archivos hay:**
```bash
ls -la
```

## 📋 Paso 3: Ejecutar Comandos de Diagnóstico

Una vez en la carpeta correcta, ejecuta estos comandos:

### Ver logs de error:
```bash
tail -20 ~/logs/error.log
```

O si hay logs específicos del dominio:
```bash
tail -20 ~/logs/ideapunkt.de/error.log
```

### Ver procesos de Node.js:
```bash
ps aux | grep node
```

### Ver procesos de Passenger:
```bash
ps aux | grep passenger
```

### Verificar BUILD_ID:
```bash
cat .next/BUILD_ID
```

### Verificar que los archivos están ahí:
```bash
ls -la diagnostico.html
ls -la public/diagnostico.html
```

### Verificar permisos:
```bash
ls -la | grep diagnostico
```

## 🚨 Si No Puedes Conectarte

### Problema: "Permission denied"
- Verifica que tu contraseña es correcta
- Verifica que Shell Access está habilitado en el panel

### Problema: "Connection refused"
- Verifica que estás usando el servidor correcto
- Prueba con el servidor específico que te dio DreamHost

### Problema: No sabes tu usuario
- Ve al panel de DreamHost
- Users → Manage Users
- Ahí verás tu nombre de usuario

## 💡 Alternativa: Terminal Web en el Panel

Si no puedes usar SSH desde tu Mac:

1. **Ve al panel de DreamHost**
2. **Busca "Web Shell" o "Terminal" en el menú**
3. **Se abrirá un terminal en tu navegador**
4. **Ejecuta los mismos comandos de arriba**

## 📝 Script de Diagnóstico Completo

Una vez conectado, puedes copiar y pegar este script completo:

```bash
echo "=== DIAGNÓSTICO COMPLETO ==="
echo ""
echo "1. Ubicación actual:"
pwd
echo ""
echo "2. Archivos en la raíz:"
ls -la | head -20
echo ""
echo "3. BUILD_ID:"
cat .next/BUILD_ID 2>/dev/null || echo "No existe .next/BUILD_ID"
echo ""
echo "4. Procesos de Node.js:"
ps aux | grep node | grep -v grep || echo "No hay procesos de Node.js"
echo ""
echo "5. Procesos de Passenger:"
ps aux | grep passenger | grep -v grep || echo "No hay procesos de Passenger"
echo ""
echo "6. Archivo diagnostico.html:"
ls -la diagnostico.html 2>/dev/null || echo "No existe diagnostico.html en la raíz"
ls -la public/diagnostico.html 2>/dev/null || echo "No existe diagnostico.html en public/"
echo ""
echo "7. Últimos errores del log:"
tail -10 ~/logs/error.log 2>/dev/null || echo "No se pudo leer el log"
echo ""
echo "=== FIN DEL DIAGNÓSTICO ==="
```

Copia todo el script, pégalo en la terminal SSH, y presiona Enter. Te mostrará toda la información importante.

