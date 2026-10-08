<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://nolimitgoods.co.uk/#organization',
          'name': 'NoLimitGoods',
          'url': 'https://nolimitgoods.co.uk',
          'logo': 'https://nolimitgoods.co.uk/logo.png',
          'description': 'Procurement, sourcing, and logistics specialist for industrial and heavy machinery spare parts.',
          'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'customer support',
            'telephone': '+380501400245',
            'availableLanguage': ['English', 'Ukrainian'],
          },
        },
        {
          '@type': 'Service',
          '@id': 'https://nolimitgoods.co.uk/#service',
          'name': 'Heavy Machinery Parts Sourcing & Logistics',
          'provider': {
            '@id': 'https://nolimitgoods.co.uk/#organization',
          },
          'serviceType': 'Spare Parts Export & Delivery',
          'areaServed': ['United Kingdom', 'European Union', 'Ukraine'],
          'offers': {
            '@type': 'Offer',
            'availability': 'https://schema.org/InStock',
            'priceCurrency': 'GBP',
          },
        },
      ],
    }),
  }}
/>
