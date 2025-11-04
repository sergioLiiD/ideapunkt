# Guía de Despliegue en DreamHost

## Opción 1: Despliegue Estático (Recomendado si no necesitas API routes)

Si no necesitas el endpoint `/api/chat` funcionando en el servidor, puedes generar una build estática:

### Pasos:

1. **Generar build estática** (si es posible):
   ```bash
   npm run build
   ```

2. **Subir archivos a DreamHost**:
   - Sube la carpeta `.next/` completa
   - Sube la carpeta `public/` completa
   - Sube `package.json` y `package-lock.json`
   - Sube `next.config.js`

3. **Configurar servidor Node.js en DreamHost**:
   - Ve al panel de DreamHost
   - Activa Node.js para tu dominio
   - Configura el comando de inicio: `npm start`
   - El servidor se ejecutará en el puerto que DreamHost asigne

## Opción 2: Despliegue con Node.js (Recomendado para API routes)

Si necesitas que el endpoint `/api/chat` funcione, necesitas Node.js:

### Pasos:

1. **Preparar archivos para subir**:
   ```bash
   # Asegúrate de tener el build generado
   npm run build
   ```

2. **Archivos a subir a DreamHost**:
   ```
   .next/              # Carpeta con el build
   public/             # Archivos estáticos
   app/                # Páginas y API routes
   components/         # Componentes React
   node_modules/       # Dependencias (o instalar en servidor)
   package.json        # Dependencias
   package-lock.json   # Lock file
   next.config.js      # Configuración de Next.js
   tsconfig.json       # Configuración TypeScript
   .env.local          # Variables de entorno (NO subir a git)
   ```

3. **Configurar Node.js en DreamHost**:
   - Panel de DreamHost → Domains → Manage Domains
   - Selecciona tu dominio y activa "Web Hosting"
   - Activa "Passenger" o "Node.js" (si está disponible)
   - Configura el directorio de la aplicación
   - Configura el comando de inicio: `npm start`

4. **Configurar variables de entorno en DreamHost**:
   - En el panel de DreamHost, busca "Environment Variables" o "Passenger ENV"
   - Agrega:
     ```
     NEXT_PUBLIC_VAPI_PUBLIC_KEY=tu_public_key
     VAPI_API_KEY=tu_api_key_privada
     NEXT_PUBLIC_VAPI_ASSISTANT_ID=tu_assistant_id
     NEXT_PUBLIC_BASE_URL=https://ideapunkt.de
     ```

5. **Instalar dependencias en el servidor**:
   ```bash
   # Conéctate por SSH a DreamHost
   cd /home/tu_usuario/tu_dominio.com
   npm install --production
   ```

6. **Iniciar la aplicación**:
   - Si usas Passenger, se iniciará automáticamente
   - Si no, ejecuta: `npm start`

## Opción 3: Despliegue Estático con Export (Sin API)

Si no necesitas el endpoint `/api/chat` en el servidor, puedes exportar como sitio estático:

### Modificar `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Deshabilitar API routes si no las necesitas
  // api: {
  //   externalResolver: true,
  // },
}

module.exports = nextConfig
```

Luego:
```bash
npm run build
```

Esto generará una carpeta `out/` que puedes subir directamente a DreamHost como sitio estático.

**⚠️ IMPORTANTE**: Con esta opción, el endpoint `/api/chat` NO funcionará porque es un sitio estático. Necesitarías mover la lógica del chat a un servicio externo o usar VAPI directamente desde el cliente.

## Configuración de Dominio

1. **Configurar DNS**:
   - Asegúrate de que el dominio apunte a DreamHost
   - Configura SSL/HTTPS en el panel de DreamHost

2. **Variables de entorno**:
   - Asegúrate de que `NEXT_PUBLIC_BASE_URL` apunte a tu dominio real
   - Ejemplo: `https://ideapunkt.de`

## Verificación Post-Despliegue

1. Verifica que el sitio carga: `https://ideapunkt.de`
2. Verifica sitemap: `https://ideapunkt.de/sitemap.xml`
3. Verifica robots.txt: `https://ideapunkt.de/robots.txt`
4. Prueba el chatbot (modo voz y texto)
5. Verifica que las imágenes se cargan correctamente

## Troubleshooting

### Error: "Cannot find module"
- Verifica que `node_modules` está instalado: `npm install --production`
- Verifica que todas las dependencias están en `package.json`

### Error: "API route not found"
- Verifica que el servidor Node.js está activo
- Verifica que las variables de entorno están configuradas
- Verifica los logs en DreamHost

### Error: "Environment variable not found"
- Verifica que las variables están configuradas en el panel de DreamHost
- Verifica que el archivo `.env.local` está en el servidor (si usas archivo)

## Notas Importantes

- **NO subir `.env.local` a git** - Usa variables de entorno del servidor
- **NO subir `node_modules` a git** - Instálalos en el servidor
- **NO subir `.next` a git** - Genera el build en el servidor o súbelo manualmente
- El puerto por defecto de Next.js es 3500, pero DreamHost puede usar otro puerto
- Verifica la documentación de DreamHost para Node.js/Passenger

