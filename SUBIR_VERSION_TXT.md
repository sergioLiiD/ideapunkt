# 📤 Cómo Subir version.txt Correctamente

## 🔍 Problema Actual
El archivo `version.txt` devuelve 404, lo que significa que no está en el servidor o no está en la ubicación correcta.

## 📍 Ubicación Correcta del Archivo

### En tu máquina local:
```
/Users/sergio/Projects/landing-ideapunkt/public/version.txt
```

### En el servidor (DreamHost):
El archivo debe estar en:
```
~/ideapunkt.de/public/version.txt
```

**IMPORTANTE**: En Next.js, los archivos de `public/` se sirven desde la raíz, así que:
- `public/version.txt` → Accesible como `https://ideapunkt.de/version.txt`

## ✅ Pasos para Subir el Archivo

### Opción 1: Subir carpeta public/ completa

**Asegúrate de subir toda la carpeta `public/` que contiene:**
- `version.txt` ✅
- `logo-ideapunkt.svg`
- `robots.txt`

**Estructura en el servidor debe ser:**
```
~/ideapunkt.de/
├── public/
│   ├── version.txt          ← DEBE ESTAR AQUÍ
│   ├── logo-ideapunkt.svg
│   └── robots.txt
├── .next/
├── app/
└── ...
```

### Opción 2: Subir solo version.txt

Si solo quieres subir el archivo específico:

1. **Ubicación local:**
   ```
   /Users/sergio/Projects/landing-ideapunkt/public/version.txt
   ```

2. **Sube a:**
   ```
   ~/ideapunkt.de/public/version.txt
   ```

3. **Verifica que el contenido es:**
   ```
   BUILD_ID: build-1763038018480
   TIMESTAMP: 2025-01-14
   VERSION: 2.0
   STATUS: ACTUALIZADO
   ```

## 🔍 Verificación en el Servidor (SSH)

**Conéctate por SSH:**
```bash
ssh tu_usuario@ideapunkt.de
cd ~/ideapunkt.de
```

**Verifica que el archivo existe:**
```bash
# Verificar que existe
ls -la public/version.txt

# Ver el contenido
cat public/version.txt

# Debe mostrar:
# BUILD_ID: build-1763038018480
# TIMESTAMP: 2025-01-14
# VERSION: 2.0
# STATUS: ACTUALIZADO
```

**Si el archivo NO existe:**
```bash
# Crear la carpeta public si no existe
mkdir -p public

# Crear el archivo manualmente (temporal)
cat > public/version.txt << 'EOF'
BUILD_ID: build-1763038018480
TIMESTAMP: 2025-01-14
VERSION: 2.0
STATUS: ACTUALIZADO
EOF

# Verificar
cat public/version.txt
```

## 🌐 Verificar en el Navegador

**Prueba ambas URLs (con y sin www):**

1. **Sin www:**
   ```
   https://ideapunkt.de/version.txt
   ```

2. **Con www:**
   ```
   https://www.ideapunkt.de/version.txt
   ```

**Nota sobre www:**
- Si tu sitio redirige de www a sin www (o viceversa), usa la URL principal
- Verifica en el panel de DreamHost qué dominio es el principal

## 🐛 Si Sigue Dando 404

### Problema 1: Archivo no se subió

**Solución:**
1. Verifica que subiste la carpeta `public/` completa
2. Verifica permisos del archivo (debe ser legible)
3. Si usas FTP, asegúrate de subir en modo binario

### Problema 2: Ubicación incorrecta

**Solución:**
1. Verifica que está en `~/ideapunkt.de/public/version.txt`
2. NO debe estar en `~/ideapunkt.de/version.txt` (sin carpeta public)
3. NO debe estar en `~/ideapunkt.de/.next/version.txt`

### Problema 3: Next.js no está sirviendo archivos estáticos

**Solución:**
Si no usas Passenger y estás sirviendo archivos estáticos directamente:
- El archivo debe estar en la raíz del dominio: `~/ideapunkt.de/version.txt`
- O configurar el servidor web para servir desde `public/`

### Problema 4: Caché del servidor

**Solución:**
```bash
# En el servidor, verifica logs
tail -f ~/logs/error.log

# O reinicia el servidor web si es posible
```

## 📋 Checklist

Antes de reportar que no funciona:

- [ ] Archivo `public/version.txt` existe en el servidor
- [ ] Contenido del archivo es correcto (BUILD_ID: build-1763038018480)
- [ ] Permisos del archivo son correctos (legible)
- [ ] Probé ambas URLs (con y sin www)
- [ ] Verifiqué en modo incógnito
- [ ] Verifiqué que la carpeta `public/` está en la ubicación correcta

## 💡 Próximos Pasos

1. **Sube la carpeta `public/` completa** desde tu máquina local
2. **Verifica en SSH** que el archivo existe: `cat ~/ideapunkt.de/public/version.txt`
3. **Prueba en el navegador**: `https://ideapunkt.de/version.txt`
4. **Si funciona**, entonces el problema era solo que no se subió el archivo
5. **Si NO funciona**, verifica la configuración del servidor web

