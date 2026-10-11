# syntax=docker/dockerfile:1

# ============================================================
#  Valid Job Solutions — image production multi-étapes
#  Basée sur la sortie « standalone » de Next.js (image minimale).
# ============================================================

# Node 22 LTS (Node 20 est en fin de vie depuis avril 2026 : plus de correctifs).
ARG NODE_IMAGE=node:22-alpine

# ---------- 1. Dépendances ----------
FROM ${NODE_IMAGE} AS deps
# libc6-compat : requis par certaines deps natives sur Alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
# Cache npm persistant entre builds (BuildKit).
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ---------- 2. Build ----------
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Les NEXT_PUBLIC_* sont inlinés au build : on les passe en build-args.
# (Valeurs publiques par nature — ne JAMAIS passer de secret en build-arg.)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_VAPID_PUBLIC_KEY=$NEXT_PUBLIC_VAPID_PUBLIC_KEY \
    NEXT_TELEMETRY_DISABLED=1
# Cache de build Next (.next/cache) réutilisé entre builds.
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# ---------- 3. Runtime ----------
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Utilisateur non-root (sécurité).
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copie de la sortie standalone + assets statiques + public.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Healthcheck sur l'endpoint léger (« / » redirigeait puis rendait la page complète).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/api/health || exit 1

# server.js est généré par la sortie standalone de Next.js.
CMD ["node", "server.js"]
