# Valid Job Solutions — Site web

Site vitrine + réservation + dashboard admin pour l'agence de recrutement
**Valid Job Solutions** (Ben Hazez Marwen).
« Des talents vers des opportunités professionnelles concrètes à l'international. »

## 🧱 Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript strict**
- **Tailwind CSS** (design system charbon + or + blanc — `tailwind.config.ts`)
- **Framer Motion** (animations au scroll, stagger, micro-interactions)
- **Lucide React** (icônes)
- **Supabase** (Postgres + Auth + Row Level Security)
- **Zod** + **React Hook Form** (validation client & serveur)
- **sonner** (toasts)

## 📂 Structure

```
app/
  (public)/          → site vitrine (Navbar/Footer/WhatsApp partagés)
    page.tsx         → accueil (Hero, Piliers, Approche, Services, Témoignages, CTA)
    reservation/     → formulaire de réservation
  admin/             → dashboard protégé
    login/           → connexion
    [id]/            → détail d'une demande
    actions.ts       → server actions (update, signOut)
  api/reservations/  → route handler (validation serveur + anti-spam + insert)
components/ui/        → atomes (Button, Input, Card, Badge, Logo, Reveal)
components/sections/  → Hero, Pillars, Services, ReservationForm, Footer…
components/admin/     → LoginForm, AdminTable, StatsCards, ReservationDetail…
lib/supabase/         → clients browser / server / admin + middleware
lib/validations/      → schémas Zod
lib/rate-limit.ts     → anti-spam basique par IP
types/                → types métier + types DB
supabase/schema.sql   → schéma complet (tables, enums, triggers, RLS)
middleware.ts         → protège /admin/**
```

## 🚀 Installation

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs
npm run dev                  # http://localhost:3000
```

## 🔧 Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com).
2. **SQL Editor** → coller le contenu de [`supabase/schema.sql`](supabase/schema.sql) → exécuter.
   (Idempotent : ré-exécutable sans risque.)
3. Récupérer les clés dans **Project Settings → API** et remplir `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # SERVEUR UNIQUEMENT — jamais exposée au client
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Créer le premier administrateur

1. **Authentication → Users → Add user** (ou s'inscrire) avec email + mot de passe.
   Le trigger `on_auth_user_created` crée automatiquement la ligne `profiles` (`role='user'`).
2. Promouvoir ce compte en admin via le **SQL Editor** :

```sql
update public.profiles set role = 'admin' where email = 'vous@exemple.com';
```

3. Se connecter sur `/admin/login`.

## 🔐 Sécurité

- **RLS activée** sur toutes les tables. L'anon ne peut **QUE** insérer une réservation, jamais lire.
- Lecture / mise à jour / suppression des réservations **réservées aux admins** (vérif. du rôle via `profiles`).
- **service_role key** utilisée uniquement côté serveur (`lib/supabase/admin.ts`), jamais dans un composant client.
- **Double validation** : Zod côté client (formulaire) + revalidation serveur dans `app/api/reservations/route.ts` avant tout INSERT.
- **Anti-spam** : honeypot caché (`website`) + rate limiting par IP (5 req/min).
- **Middleware** : protège `/admin/**` et revérifie le rôle admin (pas seulement la session).
- **En-têtes de sécurité** dans `next.config.mjs` (CSP de base, X-Frame-Options, HSTS, etc.).
- **Aucun secret en dur** : tout via `.env.local` (voir `.env.example`).

## 🎬 Variants Framer Motion utilisés

| Endroit | Effet | Implémentation |
|---|---|---|
| **Hero — titre** | Reveal mot à mot depuis le bas (text masking) | `staggerChildren` sur le conteneur + `y: '110%' → '0%'` par mot, dans un `overflow-hidden` |
| **Hero — fond** | Zoom parallax léger au chargement | `initial={{scale:1.12}} animate={{scale:1}}` sur 1.6 s |
| **Sections (Reveal)** | Apparition au scroll | `fadeUp` : `opacity:0,y:50 → opacity:1,y:0` + `whileInView` / `viewport={{once:true}}` |
| **Cartes (Piliers/Services)** | Apparition en cascade | `staggerContainer` (`staggerChildren: 0.12`) + variant `fadeUp` enfants |
| **Stepper 3 piliers** | Ligne dorée qui se « dessine » | `useScroll` + `useTransform` → `pathLength` animé sur un `<motion.line>` SVG |
| **Hover** | Cartes `y:-6` / scale image 105% ; boutons `scale:1.03` + shift doré | `whileHover` + transitions `spring` |
| **Boutons** | Ressort au clic | `whileTap={{scale:0.97}}`, `type:'spring'` |
| **WhatsApp flottant** | Pop d'entrée + ping | `scale:0→1` spring + halo `animate-ping` |
| **Navbar mobile** | Accordéon | `AnimatePresence` + `height:0 → auto` |

## 📜 Scripts

```bash
npm run dev        # développement
npm run build      # build production
npm run start      # serveur production
npm run lint       # ESLint
npm run typecheck  # vérification TypeScript stricte
```

## ☎️ Coordonnées

- Téléphone : **98 735 633**
- WhatsApp : **23 529 938** → https://wa.me/21623529938
- Email : **validjobsolution@gmail.com**
- Réseaux : Facebook / Instagram — **Ben Hazez Marwen**
- Marchés : Tunisie 🇹🇳 + Europe 🇪🇺

## 🚀 Déploiement (Docker / Cloud)

**Variables d'environnement** (voir `.env.example`) :
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` → build **et** runtime
- `SUPABASE_SERVICE_ROLE_KEY` → **runtime uniquement** (upload CV + URLs signées)
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` → optionnel (rate limiting multi-instances)

**Docker :**
```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=... \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  --build-arg NEXT_PUBLIC_SITE_URL=https://exemple.com \
  -t valid-job-solutions .

docker run -p 3000:3000 \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -e NEXT_PUBLIC_SITE_URL=https://exemple.com \
  valid-job-solutions
```
Ou `docker compose up --build` (lit le `.env.local`).

**Endpoints utiles :** `/api/health` (healthcheck), `/robots.txt`, `/sitemap.xml`.

**Avant la prod :** roter la clé `service_role`, renseigner l'adresse réelle (`AGENCY_LAT/LNG` dans `lib/utils.ts`), exécuter `schema.sql` + migrations sur le projet Supabase de production.
