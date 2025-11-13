# 🔧 Solución: npm No Encontrado

## 🔍 Problema
El comando `npm` no se encuentra en el PATH.

## ✅ Solución: Encontrar Node.js y npm

### Paso 1: Buscar Node.js y npm

**En SSH, ejecuta estos comandos uno por uno:**

```bash
# Buscar node
which node
whereis node

# Buscar npm
which npm
whereis npm

# Verificar si están en ubicaciones comunes de DreamHost
ls -la /usr/bin/node* 2>/dev/null
ls -la /usr/bin/npm* 2>/dev/null
ls -la /usr/local/bin/node* 2>/dev/null
ls -la /usr/local/bin/npm* 2>/dev/null

# Verificar versión de Node.js (si está en PATH)
node --version 2>/dev/null || echo "node no encontrado en PATH"
```

### Paso 2: Usar la Ruta Completa

Si encuentras Node.js pero no npm, o viceversa, usa la ruta completa:

**Ejemplo si node está en `/usr/bin/node`:**
```bash
/usr/bin/node --version
/usr/bin/npm --version
```

**O si está en otra ubicación:**
```bash
# Buscar todos los ejecutables de node
find /usr -name "node" -type f 2>/dev/null
find /usr -name "npm" -type f 2>/dev/null
```

### Paso 3: Instalar con la Ruta Completa

Una vez que encuentres npm, usa la ruta completa:

```bash
/usr/bin/npm install --production
```

O la ruta que hayas encontrado.

### Paso 4: Alternativa - Usar nvm (Node Version Manager)

Si DreamHost tiene nvm instalado:

```bash
# Cargar nvm
source ~/.nvm/nvm.sh 2>/dev/null || source ~/.bashrc

# Verificar
node --version
npm --version

# Si funciona, instalar dependencias
npm install --production
```

### Paso 5: Verificar Variables de Entorno

```bash
# Ver PATH actual
echo $PATH

# Ver si hay variables de Node.js
env | grep -i node
env | grep -i npm
```

## 🚨 Si Nada Funciona

### Opción A: Contactar Soporte de DreamHost

Pregunta:
> "Necesito instalar dependencias de Node.js para mi aplicación Next.js. ¿Dónde está npm instalado o cómo puedo instalarlo?"

### Opción B: Instalar Node.js Manualmente (si está permitido)

```bash
# Verificar si puedes instalar
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install node
npm install --production
```

## 💡 Comandos Rápidos para Ejecutar

**Ejecuta estos comandos y comparte los resultados:**

```bash
which node
which npm
ls -la /usr/bin/node* 2>/dev/null
ls -la /usr/bin/npm* 2>/dev/null
node --version 2>/dev/null || echo "node no encontrado"
npm --version 2>/dev/null || echo "npm no encontrado"
```

Con estos resultados podré darte la solución exacta.

