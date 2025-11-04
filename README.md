# Landing Page Ideapunkt

Landing page moderna con shader Three.js y chatbot VAPI integrado.

## Características

- 🎨 Shader Three.js con Perlin noise para efectos visuales únicos
- 🤖 Chatbot VAPI integrado (modo voz y texto)
- 📱 Diseño responsive
- ⚡ Optimizado para performance
- 🔍 SEO completo y estructurado

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env.local` con las siguientes variables:

```env
# VAPI Configuration
NEXT_PUBLIC_VAPI_PUBLIC_KEY=tu_public_key_aqui
VAPI_API_KEY=tu_api_key_privada_aqui
NEXT_PUBLIC_VAPI_ASSISTANT_ID=tu_assistant_id_aqui

# SEO Configuration (opcional)
NEXT_PUBLIC_BASE_URL=https://ideapunkt.de
```

## Desarrollo

```bash
npm run dev
```

El proyecto se ejecutará en `http://localhost:3500`

## Estructura

- `/app` - Páginas y layout de Next.js
  - `layout.tsx` - Metadata y configuración SEO
  - `sitemap.ts` - Generación automática de sitemap
  - `robots.ts` - Configuración de robots.txt
- `/components` - Componentes React
  - `ShaderBackground.tsx` - Componente del shader Three.js
  - `Scene.tsx` - Escena de Three.js
  - `ChatbotContainer.tsx` - Contenedor para el chatbot VAPI
  - `StructuredData.tsx` - Datos estructurados para SEO (JSON-LD)

## SEO

El proyecto incluye una estructura SEO completa:

- ✅ Metadata completa (title, description, keywords)
- ✅ Open Graph tags para redes sociales
- ✅ Twitter Card tags
- ✅ Structured Data (JSON-LD) - Schema.org
- ✅ Sitemap.xml automático
- ✅ Robots.txt configurado
- ✅ Canonical URLs
- ✅ Multi-idioma (preparado para ES, DE, EN)

### Archivos de imagen necesarios para SEO

Agrega estos archivos en `/public`:
- `og-image.jpg` (1200x630px) - Imagen para Open Graph
- `favicon.svg` - Favicon
- `apple-touch-icon.png` (180x180px) - Icono para iOS

### Verificación de motores de búsqueda

Edita `app/layout.tsx` y agrega tus códigos de verificación en la sección `verification`:
- Google Search Console
- Bing Webmaster Tools
- Yandex

## Próximos pasos

- [ ] Agregar imagen OG (og-image.jpg)
- [ ] Agregar favicon y apple-touch-icon
- [ ] Configurar códigos de verificación de motores de búsqueda
- [ ] Agregar links de redes sociales en StructuredData
- [ ] Optimizaciones de performance adicionales

