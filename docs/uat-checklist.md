# Checklist UAT — validation manuelle avant production

À dérouler sur l'**URL de préversion** (postée par le workflow *Deploy Staging*
sur chaque PR) avant d'approuver le déploiement production.

> La promotion en production est **bloquée par une approbation manuelle**
> (GitHub → Settings → Environments → `production` → Required reviewers).
> Approuver le run seulement une fois cette checklist passée.

## Site public

- [ ] `/` redirige vers `/fr` ; le contenu s'affiche sans erreur console
- [ ] Les 3 locales fonctionnent : `/fr`, `/en`, `/ar` (l'arabe est en RTL)
- [ ] Navigation complète : sections accueil, liens footer, bouton WhatsApp
- [ ] Page réservation : le formulaire s'affiche, la carte Google est visible

## Flux de réservation (critique)

- [ ] Soumission vide → messages d'erreur clairs, pas d'envoi
- [ ] Réservation valide **sans CV** → toast de succès
- [ ] Réservation valide **avec CV PDF** → succès ; fichier visible côté admin
- [ ] CV refusé : fichier > 5 Mo, ou extension non autorisée (.exe, .png)
- [ ] La réservation apparaît dans le dashboard admin avec les bons champs

## Espace admin (critique)

- [ ] `/admin` sans session → redirection vers `/admin/login`
- [ ] Connexion avec un compte **non admin** → accès refusé
- [ ] Connexion admin valide → dashboard avec stats et tableau
- [ ] Détail d'une demande : changement de statut + note admin sauvegardés
- [ ] Téléchargement du CV via l'URL signée (et expiration après ~60 s)
- [ ] Déconnexion → retour au login, `/admin` de nouveau protégé

## Divers

- [ ] `/api/health` renvoie `{"status":"ok"}`
- [ ] Lighthouse rapide (onglet Performance) : pas de régression majeure
- [ ] Notifications push admin : activation OK (si configurées sur cet env)
