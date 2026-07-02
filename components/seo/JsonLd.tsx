import {
  CONTACT_EMAIL,
  AGENCY_ADDRESS,
  AGENCY_LAT,
  AGENCY_LNG,
} from '@/lib/utils';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// Données structurées Schema.org — LocalBusiness (SEO local Tunisie).
// JSON statique et contrôlé (aucune entrée utilisateur) → injection sûre.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'EmploymentAgency'],
  name: 'Valid Job Solutions',
  description:
    "Agence de recrutement et de développement de talents : identifier, préparer et propulser les talents vers des opportunités professionnelles à l'international (Tunisie & Europe).",
  url: SITE,
  logo: `${SITE}/nb.png`,
  image: `${SITE}/nb.png`,
  email: CONTACT_EMAIL,
  telephone: '+21698735633',
  founder: { '@type': 'Person', name: 'Ben Hazez Marwen' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rue des Chandelles (près de Sahloul El Gharbi)',
    addressLocality: 'Hammam Sousse',
    postalCode: '4011',
    addressCountry: 'TN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: AGENCY_LAT,
    longitude: AGENCY_LNG,
  },
  areaServed: [
    { '@type': 'Country', name: 'Tunisie' },
    { '@type': 'Place', name: 'Europe' },
    { '@type': 'Country', name: 'Canada' },
  ],
  knowsLanguage: ['fr', 'ar', 'en'],
  sameAs: [
    'https://www.instagram.com/valid_jobsolutions',
    'https://www.google.com/maps?cid=4335862039483113036',
  ],
  hasMap: 'https://www.google.com/maps?cid=4335862039483113036',
  slogan: 'Nous ne nous contentons pas de recruter… nous révélons le potentiel humain.',
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
