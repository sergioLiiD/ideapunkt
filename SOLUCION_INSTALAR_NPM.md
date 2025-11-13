# 🔧 Solución: Instalar npm

## 🔍 Problema
- ✅ Node.js está instalado en `/usr/bin/node`
- ❌ npm NO está instalado

## ✅ Solución: Instalar npm

### Opción 1: Instalar npm con Node.js (Recomendado)

**En SSH, ejecuta:**

```bash
# Verificar versión de Node.js
/usr/bin/node --version

# Instalar npm usando el instalador oficial
curl -L https://www.npmjs.com/install.sh | sh
```

**O si eso no funciona, prueba:**

```bash
# Descargar e instalar npm manualmente
cd /tmp
curl -L https://registry.npmjs.org/npm/-/npm-9.9.2.tgz | tar -xz
cd package
/usr/bin/node bin/npm-cli.js install -g
```

### Opción 2: Usar npx (si está disponible)

Si `npx` está disponible, puedes usarlo:

```bash
# Buscar npx
which npx
/usr/bin/npx --version 2>/dev/null || echo "npx no encontrado"

# Si npx existe, puedes usarlo para instalar
/usr/bin/npx npm install --production
```

### Opción 3: Instalar npm desde el repositorio del sistema

```bash
# Intentar instalar desde apt (puede requerir permisos de sudo)
sudo apt update
sudo apt install npm -y
```

**Nota:** Esto puede no funcionar si no tienes permisos de sudo.

### Opción 4: Usar el instalador de npm directamente

```bash
# Crear directorio temporal
mkdir -p ~/tmp
cd ~/tmp

# Descargar npm
curl -L https://registry.npmjs.org/npm/-/npm-9.9.2.tgz -o npm.tgz
tar -xzf npm.tgz
cd package

# Instalar npm usando node
/usr/bin/node bin/npm-cli.js install -g --prefix=$HOME/.local
```

Luego agregar al PATH:
```bash
export PATH=$HOME/.local/bin:$PATH
npm install --production
```

## 🚨 Si Nada Funciona

### Contactar Soporte de DreamHost

Pregunta específica:
> "Tengo Node.js instalado en `/usr/bin/node` pero npm no está disponible. Necesito instalar dependencias para mi aplicación Next.js. ¿Cómo puedo instalar npm o dónde está disponible?"

### Alternativa: Subir node_modules desde tu máquina local

Si no puedes instalar npm en el servidor, puedes:

1. **En tu máquina local:**
   ```bash
   cd /Users/sergio/Projects/landing-ideapunkt
   npm install --production
   ```

2. **Subir la carpeta `node_modules` al servidor** (puede ser grande, varios MB)

3. **En el servidor, verificar:**
   ```bash
   ls -la node_modules | head -10
   ```

## 💡 Comandos para Ejecutar Ahora

**Ejecuta estos comandos y comparte los resultados:**

```bash
# 1. Verificar versión de Node.js
/usr/bin/node --version

# 2. Buscar npx
which npx
/usr/bin/npx --version 2>/dev/null || echo "npx no encontrado"

# 3. Intentar instalar npm con curl
curl -L https://www.npmjs.com/install.sh | sh
```

**Si el comando 3 funciona, luego ejecuta:**
```bash
npm install --production
```

**Si no funciona, prueba:**
```bash
# Verificar si npm se instaló en alguna ubicación
which npm
~/.local/bin/npm --version 2>/dev/null || echo "npm no en .local"
```

## 📋 Próximos Pasos

1. **Ejecuta los comandos de arriba**
2. **Comparte los resultados**
3. **Si npm se instala, ejecuta `npm install --production`**
4. **Luego reinicia Passenger con `touch tmp/restart.txt`**

¡Avísame qué pasa con estos comandos!

