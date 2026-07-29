# Monitoring & logs

## Ce qui est surveillé aujourd'hui

| Quoi | Où | Comment |
|---|---|---|
| Disponibilité | `/api/health` | Renvoie `{"status":"ok"}` + horodatage. Sondé par les smoke tests post-déploiement et utilisable par tout uptime-monitor externe. |
| Échecs post-déploiement | GitHub Issues | Le workflow *Deploy Production* ouvre automatiquement une issue étiquetée `production`/`incident` si les smoke tests échouent. |
| Erreurs runtime (serveur) | Dashboard Vercel → *Logs* | `console.error` des routes API et Server Components (upload CV échoué, insert échoué, erreurs middleware). |
| Erreurs de build | GitHub Actions (CI) + Vercel → *Deployments* | Le build CI échoue avant merge ; Vercel bloque le déploiement si son build échoue. |
| Vulnérabilités deps | Dependabot + `npm audit` (CI) | PRs hebdomadaires groupées ; le CI échoue sur high/critical. |

## Où regarder quand quelque chose casse

1. **Le site est down** → Vercel → Deployments : le dernier déploiement est-il
   vert ? Sinon *Promote previous deployment* (rollback en un clic).
2. **Erreur 500 sur une action précise** → Vercel → Logs, filtrer par route
   (`/api/reservations`, `/admin`). Les messages d'erreur applicatifs y sont.
3. **Issue `incident` ouverte automatiquement** → suivre le lien du run pour
   voir quel smoke test a échoué (accueil, health, ou login admin).
4. **Réservations qui n'arrivent plus** → vérifier les quotas/statut du projet
   Supabase (pause après inactivité sur le plan gratuit) puis les logs Vercel.

## Amélioration recommandée : Sentry (non installé)

Le suivi d'erreurs applicatif (stack traces, alertes, source maps) n'est pas
encore branché — il nécessite un compte et un DSN. Quand vous êtes prêt :

1. Créer un projet sur [sentry.io](https://sentry.io) (plan gratuit suffisant).
2. `npx @sentry/wizard@latest -i nextjs` (configure `@sentry/nextjs` automatiquement).
3. Ajouter `SENTRY_DSN` aux variables d'environnement Vercel.

Un uptime-monitor externe gratuit (ex. UptimeRobot sur `/api/health`, ping
toutes les 5 min) est aussi conseillé — il détecte les pannes entre deux
déploiements, contrairement aux smoke tests.
