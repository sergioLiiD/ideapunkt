# 🔧 Solución: Instalar npm Compatible con Node.js v12

## 🔍 Problema
- Node.js v12.22.9 es muy antiguo
- npm 11.6.2 requiere Node.js más reciente
- Necesitamos instalar npm 6.x (compatible con Node.js v12)

## ✅ Solución: Instalar npm 6.x

### Opción 1: Instalar npm 6.x Manualmente (Recomendado)

**En SSH, ejecuta:**

```bash
# Crear directorio temporal
mkdir -p ~/tmp
cd ~/tmp

# Descargar npm 6.14.18 (última versión compatible con Node.js 12)
curl -L https://registry.npmjs.org/npm/-/npm-6.14.18.tgz -o npm.tgz

# Extraer
tar -xzf npm.tgz

# Instalar npm globalmente
cd package
/usr/bin/node bin/npm-cli.js install -g --prefix=$HOME/.local

# Agregar al PATH
export PATH=$HOME/.local/bin:$PATH

# Verificar instalación
npm --version

# Si funciona, instalar dependencias
cd ~/ideapunkt.de
npm install --production
```

### Opción 2: Usar npx si está disponible

```bash
# Verificar si npx existe
which npx
/usr/bin/npx --version 2>/dev/null || echo "npx no encontrado"

# Si npx existe, puedes usarlo
/usr/bin/npx -p npm@6 npm install --production
```

### Opción 3: Instalar npm desde el repositorio del sistema

```bash
# Intentar instalar npm desde apt (puede tener versión compatible)
sudo apt update
sudo apt install npm -y

# Verificar
npm --version
```

**Nota:** Esto puede instalar una versión antigua pero compatible.

## 🚨 Si Nada Funciona: Subir node_modules desde tu Máquina

Si no puedes instalar npm en el servidor, la mejor opción es:

### Paso 1: En tu Máquina Local

```bash
cd /Users/sergio/Projects/landing-ideapunkt

# Instalar dependencias
npm install --production

# Verificar que se instaló
ls -la node_modules | head -10
```

### Paso 2: Subir node_modules al Servidor

Usa FileZilla, SFTP, o el File Manager de DreamHost para subir la carpeta `node_modules` completa al servidor.

**Ubicación en el servidor:**
```
/home/ideapunkt_admin/ideapunkt.de/node_modules/
```

### Paso 3: Verificar en el Servidor

```bash
cd ~/ideapunkt.de
ls -la node_modules | head -10
```

## 💡 Comandos para Ejecutar Ahora

**Ejecuta la Opción 1 paso a paso:**

```bash
# 1. Crear directorio temporal
mkdir -p ~/tmp
cd ~/tmp

# 2. Descargar npm 6.14.18
curl -L https://registry.npmjs.org/npm/-/npm-6.14.18.tgz -o npm.tgz

# 3. Extraer
tar -xzf npm.tgz

# 4. Instalar
cd package
/usr/bin/node bin/npm-cli.js install -g --prefix=$HOME/.local

# 5. Agregar al PATH
export PATH=$HOME/.local/bin:$PATH

# 6. Verificar
npm --version

# 7. Si funciona, instalar dependencias
cd ~/ideapunkt.de
npm install --production
```

## 📋 Próximos Pasos

1. **Ejecuta los comandos de la Opción 1**
2. **Si funciona, ejecuta `npm install --production`**
3. **Luego reinicia Passenger: `touch tmp/restart.txt`**
4. **Espera 30-60 segundos**
5. **Verifica que Node.js está corriendo: `ps aux | grep node`**

## 🎯 Alternativa Rápida

Si los comandos no funcionan, la opción más rápida es:
1. Instalar dependencias en tu máquina local
2. Subir `node_modules` al servidor
3. Reiniciar Passenger

¡Prueba la Opción 1 y dime qué pasa!

