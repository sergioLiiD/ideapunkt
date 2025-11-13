# 🔍 Verificar Ubicación y Archivos

## Comandos para Ejecutar (Uno por Uno)

### Paso 1: Ver dónde estás

```bash
pwd
```

### Paso 2: Ver todos los archivos y carpetas en el directorio actual

```bash
ls -la
```

### Paso 3: Verificar si .next existe (con ruta completa)

```bash
ls -la /home/ideapunkt_admin/ideapunkt.de/.next/ 2>/dev/null || echo "No existe en esa ruta"
```

### Paso 4: Buscar .next en todo tu directorio home

```bash
find ~ -name ".next" -type d 2>/dev/null
```

### Paso 5: Ver qué archivos hay en el directorio actual

```bash
ls -la | head -20
```

### Paso 6: Verificar si estás en el directorio correcto buscando package.json

```bash
ls -la package.json
cat package.json | head -5
```

## 🎯 Qué Hacer

Ejecuta estos 6 comandos uno por uno y comparte TODOS los resultados. Con eso podré ver:
- Dónde estás realmente
- Si .next existe y dónde está
- Qué archivos hay en el directorio

