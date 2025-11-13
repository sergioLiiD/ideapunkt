# 🔍 Verificar Estructura de .next

## Comandos para Ejecutar

### Paso 1: Ver qué hay en .next/server/app/

```bash
ls -la .next/server/app/
```

### Paso 2: Ver estructura completa de .next/

```bash
find .next -type f | head -20
```

### Paso 3: Ver qué hay en .next/static/

```bash
ls -la .next/static/ 2>/dev/null
find .next/static -type f | head -10
```

### Paso 4: Buscar archivos HTML en toda la carpeta .next/

```bash
find .next -name "*.html" -type f 2>/dev/null
```

### Paso 5: Verificar si hay archivos en la raíz que Apache esté sirviendo

```bash
ls -la *.html 2>/dev/null
ls -la index.html 2>/dev/null
```

### Paso 6: Verificar qué está sirviendo Apache realmente

```bash
# Ver el contenido de .htaccess completo
cat .htaccess

# Ver si hay configuración de DocumentRoot
grep -i "documentroot\|directory" .htaccess
```

### Paso 7: Verificar el contenido de app/page.tsx actual

```bash
head -60 app/page.tsx | grep -A 5 "ACTUALIZADO\|build-"
```

