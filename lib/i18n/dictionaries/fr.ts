// Dictionnaire FR — source de vérité (le type est dérivé de cet objet).
export const fr = {
  nav: {
    home: 'Accueil',
    approach: 'Notre approche',
    services: 'Services',
    reservation: 'Réservation',
    contact: 'Contact',
    cta: 'Réserver un entretien',
  },
  hero: {
    badge: 'Tunisie + Europe',
    title: ['Révélons', 'votre', 'potentiel', 'professionnel'],
    subtitle:
      "Des talents vers des opportunités professionnelles concrètes à l'international. Nous identifions, préparons et propulsons votre carrière.",
    ctaPrimary: 'Réserver un entretien',
    ctaSecondary: 'Découvrir notre approche',
    quote:
      '« Nous ne nous contentons pas de recruter… nous révélons le potentiel humain. »',
  },
  pillars: {
    title: 'Notre méthode en trois temps',
    subtitle:
      'Un parcours structuré qui transforme votre potentiel en opportunités réelles.',
    step: 'Étape',
    items: [
      {
        title: 'Identifier',
        text: 'Nous détectons le talent, les compétences et le potentiel réel de chaque candidat grâce à une évaluation rigoureuse et bienveillante.',
      },
      {
        title: 'Préparer',
        text: 'Coaching, CV, lettres de motivation, préparation aux entretiens et mise à niveau : nous vous donnons toutes les armes pour réussir.',
      },
      {
        title: 'Propulser',
        text: "Placement vers des opportunités professionnelles concrètes à l'international, en Europe comme en Tunisie.",
      },
    ],
  },
  approach: {
    title: 'Pourquoi Valid Job Solutions ?',
    text: "Nous ne nous contentons pas de recruter. Nous accompagnons chaque talent dans la révélation de son potentiel, jusqu'à une opportunité professionnelle concrète à l'international.",
    points: [
      {
        title: "L'humain d'abord",
        text: 'Chaque candidat est unique. Nous révélons le potentiel humain avant de parler postes.',
      },
      {
        title: 'Vision internationale',
        text: "Un réseau d'employeurs en Europe et en Tunisie pour des débouchés concrets.",
      },
      {
        title: 'Accompagnement complet',
        text: "De l'évaluation au placement, en passant par l'administratif et le visa.",
      },
    ],
  },
  services: {
    title: 'Nos services',
    subtitle:
      'Un accompagnement sur mesure, à chaque étape de votre projet professionnel.',
    reserve: 'Réserver ce service',
    items: [
      {
        title: 'Coaching CV & lettre de motivation',
        text: 'Des documents percutants, adaptés aux standards européens, qui valorisent votre parcours.',
      },
      {
        title: 'Préparation aux entretiens',
        text: 'Simulations, posture, argumentaire : abordez vos entretiens avec confiance.',
      },
      {
        title: 'Placement international',
        text: 'Mise en relation directe avec des opportunités concrètes en Europe et en Tunisie.',
      },
      {
        title: 'Accompagnement administratif & visa',
        text: "Nous vous guidons dans les démarches administratives et l'obtention du visa.",
      },
      {
        title: 'Mise en relation employeurs EU',
        text: "Accès à notre réseau d'employeurs partenaires en quête de talents.",
      },
      {
        title: 'Consultation & orientation',
        text: 'Un bilan personnalisé pour définir la stratégie carrière la plus adaptée.',
      },
    ],
  },
  testimonials: {
    title: 'Ils ont révélé leur potentiel',
    items: [
      {
        name: 'Sarra B.',
        role: 'Infirmière — placée en Allemagne',
        text: "Grâce à Valid Job Solutions, j'ai décroché un poste en Allemagne. L'accompagnement visa et la préparation aux entretiens ont tout changé.",
      },
      {
        name: 'Mehdi T.',
        role: 'Ingénieur — placé en France',
        text: "Une équipe humaine et professionnelle. Mon CV a été transformé et j'ai été coaché jusqu'à la signature de mon contrat.",
      },
      {
        name: 'Ines K.',
        role: 'Technicienne — Tunisie',
        text: "On m'a vraiment écoutée. Ils ont révélé un potentiel que je ne soupçonnais pas et m'ont orientée vers le bon métier.",
      },
    ],
  },
  cta: {
    title: "Prêt à propulser votre carrière à l'international ?",
    subtitle:
      'Réservez un entretien gratuit et découvrez comment nous pouvons révéler votre potentiel.',
    button: 'Réserver un entretien',
  },
  footer: {
    findUs: 'Nous trouver',
    directions: 'Itinéraire',
    navigation: 'Navigation',
    contact: 'Contact',
    rights: 'Tous droits réservés.',
    founder: 'Fondateur : Ben Hazez Marwen',
  },
  reservation: {
    title: 'Réserver un entretien',
    subtitle:
      'Remplissez ce formulaire : notre équipe vous recontacte rapidement pour révéler votre potentiel et planifier les prochaines étapes.',
    fullName: 'Nom complet',
    email: 'Email',
    phone: 'Téléphone',
    service: 'Service souhaité',
    servicePlaceholder: 'Choisir un service…',
    country: 'Pays / destination visée',
    countryPlaceholder: 'France, Allemagne, Canada, Tunisie…',
    situation: 'Situation actuelle / domaine',
    situationPlaceholder: 'Ex. Infirmier, étudiant en informatique…',
    date: 'Date souhaitée',
    slot: 'Créneau préféré',
    slotAny: 'Indifférent',
    slotMorning: 'Matin',
    slotAfternoon: 'Après-midi',
    message: 'Message / besoin précis',
    messagePlaceholder: 'Décrivez votre projet professionnel…',
    cvLabel: 'Joindre votre CV (optionnel)',
    cvHint:
      'Pour ce service, joindre votre CV actuel accélère grandement votre accompagnement.',
    cvBrowse: 'Glissez votre fichier ici, ou parcourir',
    submit: 'Envoyer ma demande',
    sending: 'Envoi…',
    uploading: 'Envoi en cours…',
    successTitle: 'Demande envoyée ✅',
    successText:
      'Merci ! Notre équipe vous recontactera très rapidement pour planifier votre entretien.',
    again: 'Envoyer une autre demande',
    services: {
      coaching_cv: 'Coaching CV & lettre de motivation',
      preparation_entretien: 'Préparation aux entretiens',
      consultation: 'Consultation générale',
    },
  },
};

export type Dictionary = typeof fr;
