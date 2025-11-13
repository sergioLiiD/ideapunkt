# 🚀 Guía Paso a Paso: Desplegar en Vercel

## ✅ Pre-requisitos Completados

- ✅ Código en GitHub: https://github.com/sergioLiiD/ideapunkt.git
- ✅ Build funcionando correctamente
- ✅ Variables de entorno identificadas

---

## 📋 PASO 1: Crear Cuenta en Vercel

1. Ve a **https://vercel.com**
2. Haz clic en **"Sign Up"** o **"Log In"**
3. **Opción A**: Inicia sesión con GitHub (recomendado)
   - Haz clic en **"Continue with GitHub"**
   - Autoriza Vercel a acceder a tus repositorios
4. **Opción B**: Crea cuenta con email

---

## 📋 PASO 2: Importar Proyecto

1. Una vez dentro del dashboard de Vercel:
   - Haz clic en **"Add New Project"** o **"New Project"**

2. **Conectar GitHub** (si no lo has hecho):
   - Vercel te pedirá conectar tu cuenta de GitHub
   - Autoriza el acceso

3. **Seleccionar Repositorio**:
   - Busca `ideapunkt` en la lista
   - Haz clic en **"Import"**

---

## 📋 PASO 3: Configurar el Proyecto

Vercel detectará automáticamente que es Next.js. Verás:

### Configuración Automática:
- **Framework Preset**: Next.js (detectado automáticamente)
- **Root Directory**: `./` (deja como está)
- **Build Command**: `next build` (automático)
- **Output Directory**: `.next` (automático)

### NO necesitas cambiar nada aquí, solo haz clic en **"Continue"**

---

## 📋 PASO 4: Configurar Variables de Entorno

**ANTES de hacer deploy**, configura las variables:

1. **En la sección "Environment Variables"**, haz clic en **"Add Variable"** o el botón **"+"**

2. **Agrega cada variable una por una**:

   **Variable 1:**
   - Name: `NEXT_PUBLIC_VAPI_PUBLIC_KEY`
   - Value: `tu_public_key_aqui`
   - Environment: Selecciona **Production**, **Preview**, y **Development**

   **Variable 2:**
   - Name: `VAPI_API_KEY`
   - Value: `tu_api_key_privada_aqui`
   - Environment: Selecciona **Production**, **Preview**, y **Development**

   **Variable 3:**
   - Name: `NEXT_PUBLIC_VAPI_ASSISTANT_ID`
   - Value: `tu_assistant_id_aqui`
   - Environment: Selecciona **Production**, **Preview**, y **Development**

   **Variable 4:**
   - Name: `NEXT_PUBLIC_BASE_URL`
   - Value: `https://ideapunkt.vercel.app` (o tu dominio personalizado)
   - Environment: Selecciona **Production**, **Preview**, y **Development**

3. **Verifica que todas estén agregadas** antes de continuar

---

## 📋 PASO 5: Deploy

1. Haz clic en **"Deploy"**
2. Vercel comenzará a:
   - Clonar tu repositorio
   - Instalar dependencias (`npm install`)
   - Hacer build (`npm run build`)
   - Desplegar

3. **Tiempo estimado**: 2-5 minutos

4. Verás el progreso en tiempo real:
   - ✅ Cloning repository
   - ✅ Installing dependencies
   - ✅ Building
   - ✅ Deploying

---

## 📋 PASO 6: Verificar el Deploy

1. **Cuando termine**, verás:
   - ✅ "Deployment successful"
   - Un enlace a tu sitio: `https://ideapunkt.vercel.app` (o similar)

2. **Haz clic en el enlace** para ver tu sitio

3. **Prueba**:
   - ✅ La página carga
   - ✅ El shader funciona
   - ✅ El chatbot funciona (modo voz y texto)
   - ✅ Sitemap: `https://tu-dominio.vercel.app/sitemap.xml`
   - ✅ Robots: `https://tu-dominio.vercel.app/robots.txt`

---

## 🔧 PASO 7: Configurar Dominio Personalizado (Opcional)

Si quieres usar `ideapunkt.de` en lugar de `ideapunkt.vercel.app`:

1. En el dashboard de Vercel, ve a tu proyecto
2. **Settings** → **Domains**
3. Agrega tu dominio: `ideapunkt.de`
4. Vercel te dará instrucciones para configurar DNS

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas `git push` a GitHub:
- ✅ Vercel detectará los cambios automáticamente
- ✅ Hará un nuevo deploy automáticamente
- ✅ Tu sitio se actualizará sin que hagas nada

---

## 🐛 Troubleshooting

### Error: "Build Failed"

**Revisa los logs**:
- En el dashboard de Vercel, haz clic en el deploy fallido
- Revisa los logs para ver el error específico

**Errores comunes**:
- Variables de entorno faltantes → Agrégalas en Settings → Environment Variables
- Errores de TypeScript → Revisa que no haya errores de tipos
- Dependencias faltantes → Verifica que `package.json` tenga todas las dependencias

### Error: "API route not found"

**Verifica**:
- Que las variables de entorno estén configuradas
- Que el archivo `/app/api/chat/route.ts` esté en el repositorio
- Los logs de Vercel para ver el error específico

### Error: Variables de entorno no funcionan

**Solución**:
1. Ve a Settings → Environment Variables
2. Verifica que las variables estén agregadas
3. Haz un nuevo deploy (Vercel → Deployments → ... → Redeploy)

---

## ✅ Checklist Final

- [ ] Cuenta creada en Vercel
- [ ] Repositorio importado desde GitHub
- [ ] Variables de entorno configuradas
- [ ] Deploy completado exitosamente
- [ ] Sitio accesible y funcionando
- [ ] Chatbot probado (voz y texto)
- [ ] Dominio personalizado configurado (opcional)

---

## 🎉 ¡Listo!

Una vez que el deploy esté completo, tu sitio estará en:
- `https://ideapunkt.vercel.app` (o el nombre que te asigne Vercel)

Y cada vez que hagas cambios y los subas a GitHub, Vercel los desplegará automáticamente.

---

## 💡 Tips

1. **Logs en tiempo real**: Puedes ver los logs mientras se hace el build
2. **Preview Deploys**: Cada pull request genera un preview URL para probar
3. **Analytics**: Vercel incluye analytics básicos en el plan gratuito
4. **Custom Domain**: Puedes agregar tu dominio personalizado gratis

¡Éxito con el despliegue! 🚀

