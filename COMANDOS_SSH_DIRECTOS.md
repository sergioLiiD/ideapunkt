# 🚀 Comandos SSH Directos - Ejecutar Uno por Uno

## 📋 Paso 1: Conectarte por SSH

En tu Terminal de Mac, ejecuta:

```bash
ssh tu_usuario@ideapunkt.de
```

(Reemplaza `tu_usuario` con tu usuario de DreamHost)

Ingresa tu contraseña cuando te la pida.

---

## 📋 Paso 2: Navegar a tu Dominio

Una vez conectado, ejecuta:

```bash
cd ~/ideapunkt.de
```

---

## 📋 Paso 3: Ejecutar Comandos de Diagnóstico

Ejecuta estos comandos **uno por uno** y copia la salida de cada uno:

### Comando 1: Ver dónde estás
```bash
pwd
```

### Comando 2: Ver archivos en la raíz
```bash
ls -la
```

### Comando 3: Verificar BUILD_ID
```bash
cat .next/BUILD_ID
```

### Comando 4: Verificar si existe diagnostico.html
```bash
ls -la diagnostico.html
```

### Comando 5: Verificar permisos de diagnostico.html
```bash
ls -la diagnostico.html
```

### Comando 6: Ver si Node.js está corriendo
```bash
ps aux | grep node | grep -v grep
```

### Comando 7: Ver si Passenger está corriendo
```bash
ps aux | grep passenger | grep -v grep
```

### Comando 8: Ver los últimos errores del log
```bash
tail -30 ~/logs/error.log
```

Si ese comando no funciona, prueba:
```bash
tail -30 ~/logs/ideapunkt.de/error.log
```

O busca logs:
```bash
find ~/logs -name "*error*" -type f 2>/dev/null | head -5
```

### Comando 9: Ver contenido de .htaccess
```bash
cat .htaccess
```

### Comando 10: Verificar si hay múltiples ubicaciones
```bash
find ~ -name "diagnostico.html" 2>/dev/null
find ~ -name ".next" -type d 2>/dev/null | head -3
```

---

## 🔍 Comando Especial: Ver Logs en Tiempo Real

Mientras intentas acceder al sitio, ejecuta esto para ver errores en tiempo real:

```bash
tail -f ~/logs/error.log
```

Luego, en otra pestaña del navegador, intenta acceder a:
- `https://ideapunkt.de/diagnostico.html`
- `https://ideapunkt.de`

Y observa qué errores aparecen en el terminal.

Para salir de `tail -f`, presiona `Ctrl + C`

---

## 📝 Qué Hacer Después

1. **Ejecuta los comandos 1-10** uno por uno
2. **Copia la salida de cada comando**
3. **Compártela aquí** para que pueda analizarla

**Especialmente importante:**
- Comando 3 (BUILD_ID) - debe mostrar `build-1763038018480`
- Comando 4 (diagnostico.html) - debe existir
- Comando 8 (logs) - mostrará qué error está causando el 500

---

## 🚨 Si Algo No Funciona

### Si `cd ~/ideapunkt.de` no funciona:
```bash
# Buscar dónde está tu dominio
find ~ -name "package.json" 2>/dev/null | grep ideapunkt
```

### Si no encuentras los logs:
```bash
# Buscar todos los logs
find ~/logs -type f -name "*.log" 2>/dev/null | head -10
```

### Si no puedes ver procesos:
```bash
# Ver todos los procesos (más información)
ps aux | head -20
```

---

## 💡 Consejo

Ejecuta los comandos uno por uno, no todos a la vez. Así puedes ver la salida de cada uno claramente.

¡Avísame qué ves en cada comando!

