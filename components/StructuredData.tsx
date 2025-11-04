export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ideapunkt',
    url: 'https://ideapunkt.de',
    logo: 'https://ideapunkt.de/logo-ideapunkt.svg',
    description: 'Ideapunkt - Soluciones innovadoras en tecnología e inteligencia artificial',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DE',
      addressLocality: 'Germany',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Spanish', 'German', 'English'],
    },
    sameAs: [
      // Agregar links de redes sociales cuando los tengas
      // 'https://www.linkedin.com/company/ideapunkt',
      // 'https://twitter.com/ideapunkt',
      // 'https://www.facebook.com/ideapunkt',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ideapunkt',
    url: 'https://ideapunkt.de',
    description: 'Ideapunkt - Soluciones innovadoras en tecnología e inteligencia artificial',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://ideapunkt.de/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Inteligencia Artificial y Tecnología',
    provider: {
      '@type': 'Organization',
      name: 'Ideapunkt',
    },
    description: 'Servicios de inteligencia artificial, chatbots, asistencia virtual y soluciones tecnológicas innovadoras',
    areaServed: {
      '@type': 'Country',
      name: 'Germany',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  )
}
