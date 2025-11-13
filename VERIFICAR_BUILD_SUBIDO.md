# ✅ Verificar que el Build se Subió Correctamente

## 🔍 Comandos para Verificar

### Paso 1: Verificar que estás en el directorio correcto

```bash
pwd
```

Debe mostrar: `/home/ideapunkt_admin/ideapunkt.de`

### Paso 2: Verificar que .next/ existe

```bash
ls -la .next/
```

### Paso 3: Verificar BUILD_ID

```bash
cat .next/BUILD_ID
```

**Debe mostrar:** `build-1763038018480` o un BUILD_ID nuevo

### Paso 4: Verificar estructura de .next/

```bash
ls -la .next/server/ 2>/dev/null || echo "No existe .next/server/"
ls -la .next/static/ 2>/dev/null || echo "No existe .next/static/"
```

### Paso 5: Verificar archivos HTML generados

```bash
find .next/server -name "*.html" -type f 2>/dev/null | head -10
```

### Paso 6: Verificar tamaño del build

```bash
du -sh .next/
```

Debe ser varios MB (no solo unos KB).

### Paso 7: Reiniciar Passenger

```bash
mkdir -p tmp
touch tmp/restart.txt
ls -la tmp/restart.txt
```

### Paso 8: Esperar y verificar procesos

**Espera 30-60 segundos** y luego:

```bash
ps aux | grep node | grep -v grep
```

## 🎯 Qué Buscar

1. **BUILD_ID debe ser nuevo** - No el antiguo
2. **.next/ debe tener varios MB** - Si es muy pequeño, no se subió completo
3. **Debe existir .next/server/** - Con archivos dentro
4. **Debe existir .next/static/** - Con archivos dentro

## 💡 Si el Build se Subió Correctamente

Después de verificar y reiniciar Passenger:
1. Prueba el sitio: `https://ideapunkt.de`
2. Debe mostrar la versión nueva
3. Si no, verifica caché del navegador (modo incógnito)

