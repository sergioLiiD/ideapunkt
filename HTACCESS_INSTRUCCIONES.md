# 📝 Instrucciones para el Archivo .htaccess

## ✅ Archivo Creado

He creado el archivo `.htaccess` en tu proyecto local. Ahora necesitas:

1. **Ajustar la ruta** con tu usuario real de DreamHost
2. **Subirlo** al servidor

---

## 🔧 PASO 1: Ajustar la Ruta

Abre el archivo `.htaccess` y reemplaza `USUARIO` con tu usuario real de DreamHost:

**Antes:**
```
PassengerAppRoot /home/USUARIO/ideapunkt.de
```

**Después (ejemplo):**
```
PassengerAppRoot /home/sergio/ideapunkt.de
```

### ¿Cómo saber tu usuario?

1. **Desde el panel de DreamHost**:
   - Panel → Users → Manage Users
   - Tu usuario aparece ahí

2. **Desde SSH**:
   ```bash
   ssh tu_usuario@ideapunkt.de
   whoami
   # Esto te mostrará tu usuario
   ```

---

## 📤 PASO 2: Subir el Archivo

### Opción A: FileZilla (FTP/SFTP)

1. Conéctate a DreamHost por SFTP
2. Navega a la raíz de tu dominio: `~/ideapunkt.de/`
3. Sube el archivo `.htaccess` (asegúrate de que esté en la raíz, junto a `package.json`)

### Opción B: Crear desde SSH

1. Conéctate por SSH:
   ```bash
   ssh tu_usuario@ideapunkt.de
   cd ~/ideapunkt.de
   ```

2. Crear el archivo:
   ```bash
   nano .htaccess
   ```

3. Pega esto (con tu usuario real):
   ```apache
   PassengerEnabled on
   PassengerAppRoot /home/tu_usuario/ideapunkt.de
   PassengerAppType node
   PassengerStartupFile package.json
   PassengerNodejs /usr/bin/node
   ```

4. Guardar: `Ctrl + X`, luego `Y`, luego `Enter`

---

## ✅ PASO 3: Verificar

1. **Verificar que el archivo está ahí**:
   ```bash
   ssh tu_usuario@ideapunkt.de
   cd ~/ideapunkt.de
   ls -la .htaccess
   # Debería mostrar el archivo
   ```

2. **Verificar contenido**:
   ```bash
   cat .htaccess
   # Debería mostrar el contenido
   ```

3. **Probar el sitio**:
   - Abre `https://ideapunkt.de` en el navegador
   - Si carga, ¡funciona!
   - Si da error, revisa los logs

---

## 🔍 PASO 4: Si No Funciona

### Ver logs de errores:
```bash
ssh tu_usuario@ideapunkt.de
tail -f ~/logs/ideapunkt.de/error.log
```

### Verificar que Passenger está corriendo:
```bash
ps aux | grep passenger
ps aux | grep node
```

### Verificar permisos:
```bash
cd ~/ideapunkt.de
chmod 644 .htaccess
```

---

## ⚠️ Notas Importantes

1. **Ruta exacta**: La ruta `/home/tu_usuario/ideapunkt.de` debe ser exacta. Si tu dominio está en otra ubicación, ajústala.

2. **Archivo oculto**: `.htaccess` es un archivo oculto (empieza con punto). Asegúrate de que se suba correctamente.

3. **Permisos**: El archivo debe tener permisos de lectura (644).

4. **Reinicio**: Después de crear el archivo, puede tardar unos minutos en activarse. Si no funciona inmediatamente, espera 2-3 minutos.

---

## 🆘 Si Sigue Sin Funcionar

Contacta a soporte de DreamHost y diles:
> "He creado un archivo .htaccess para activar Passenger con Node.js, pero mi aplicación Next.js no está funcionando. ¿Pueden revisar la configuración?"

Ellos pueden verificar la configuración desde su lado.

