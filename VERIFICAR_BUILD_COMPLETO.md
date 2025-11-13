# ✅ Verificar Build Completo

## Comandos para Ejecutar

### Paso 1: Verificar BUILD_ID

```bash
cat .next/BUILD_ID
```

**Debe mostrar:** Un BUILD_ID nuevo (no el antiguo)

### Paso 2: Ver qué hay en .next/server/

```bash
ls -la .next/server/
```

### Paso 3: Ver qué hay en .next/server/app/

```bash
ls -la .next/server/app/ 2>/dev/null || echo "No existe app/"
find .next/server -type f | head -20
```

### Paso 4: Buscar archivos HTML

```bash
find .next/server -name "*.html" -type f 2>/dev/null
```

### Paso 5: Verificar contenido de app/page.tsx (debe tener "ACTUALIZADO")

```bash
grep -A 3 "ACTUALIZADO\|build-" app/page.tsx
```

### Paso 6: Reiniciar Passenger

```bash
touch tmp/restart.txt
ls -la tmp/restart.txt
```

### Paso 7: Esperar y verificar procesos

**Espera 30-60 segundos** y luego:

```bash
ps aux | grep node | grep -v grep
```

## 🎯 Qué Buscar

1. **BUILD_ID debe ser nuevo** - Verificado en paso 1
2. **app/page.tsx debe tener "ACTUALIZADO 2025-01-14"** - Verificado en paso 5
3. **Debe haber archivos en .next/server/** - Verificado en pasos 2-3
4. **Después de reiniciar, Node.js debe estar corriendo** - Verificado en paso 7

## 💡 Si Todo Está Correcto

Después de verificar y reiniciar:
1. Prueba el sitio: `https://ideapunkt.de`
2. Debe mostrar "ACTUALIZADO 2025-01-14"
3. Si no, limpia caché del navegador (modo incógnito)

