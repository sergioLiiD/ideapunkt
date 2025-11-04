# Checklist de Despliegue en DreamHost

## ✅ Build Generado

El build se ha generado exitosamente. La carpeta `.next/` contiene todos los archivos necesarios.

## 📦 Archivos a Subir a DreamHost

### Archivos Esenciales:
- ✅ `.next/` - Carpeta completa del build (generada)
- ✅ `public/` - Archivos estáticos (logo, imágenes, etc.)
- ✅ `app/` - Páginas y API routes
- ✅ `components/` - Componentes React
- ✅ `package.json` - Dependencias
- ✅ `package-lock.json` - Lock file
- ✅ `next.config.js` - Configuración
- ✅ `tsconfig.json` - Configuración TypeScript
- ✅ `tailwind.config.js` - Configuración Tailwind
- ✅ `postcss.config.js` - Configuración PostCSS

### Archivos NO Subir (se generan/instalan):
- ❌ `node_modules/` - Instalar en el servidor con `npm install --production`
- ❌ `.env.local` - Configurar variables de entorno en DreamHost
- ❌ `.next/cache/` - Se regenera automáticamente

## 🔧 Pasos para Desplegar

### 1. Conectar por SSH a DreamHost
```bash
ssh tu_usuario@tu_dominio.com
cd ~/tu_dominio.com
```

### 2. Subir archivos
Usa FTP/SFTP o `scp` para subir los archivos listados arriba.

### 3. Instalar dependencias
```bash
npm install --production
```

### 4. Configurar variables de entorno
En el panel de DreamHost, agrega estas variables:
```
NEXT_PUBLIC_VAPI_PUBLIC_KEY=tu_public_key
VAPI_API_KEY=tu_api_key_privada
NEXT_PUBLIC_VAPI_ASSISTANT_ID=tu_assistant_id
NEXT_PUBLIC_BASE_URL=https://ideapunkt.de
NODE_ENV=production
```

### 5. Configurar Node.js en DreamHost
- Panel → Domains → Manage Domains
- Selecciona tu dominio
- Activa "Passenger" o "Node.js"
- Configura el directorio: `~/tu_dominio.com`
- Comando de inicio: `npm start`

### 6. Verificar
- ✅ `https://ideapunkt.de` - Página principal
- ✅ `https://ideapunkt.de/sitemap.xml` - Sitemap
- ✅ `https://ideapunkt.de/robots.txt` - Robots
- ✅ Chatbot funciona (voz y texto)

## ⚠️ Notas Importantes

1. **Puerto**: DreamHost asignará el puerto automáticamente. No uses `-p 3500` en producción.
2. **Variables de entorno**: NO subas `.env.local` a git. Usa el panel de DreamHost.
3. **SSL**: Asegúrate de tener SSL/HTTPS activado.
4. **Logs**: Revisa los logs en DreamHost si hay problemas.

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
cd ~/tu_dominio.com
rm -rf node_modules
npm install --production
```

### Error: "Port already in use"
- Verifica que no hay otro proceso corriendo
- DreamHost maneja el puerto automáticamente

### Error: "API route not found"
- Verifica que el servidor Node.js está activo
- Verifica que las variables de entorno están configuradas
- Revisa los logs en el panel de DreamHost

## 📝 Comandos Útiles

```bash
# Verificar que Node.js está instalado
node --version

# Verificar que npm está instalado
npm --version

# Ver procesos corriendo
ps aux | grep node

# Reiniciar la aplicación (si es necesario)
# En DreamHost, generalmente se reinicia automáticamente
```

