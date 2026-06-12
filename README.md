# FundOS

Plateforme de financement mettant en relation porteurs de projets (founders) et investisseurs, pilotée par des agents IA : ingestion de documents, matching, scoring, études de marché, signaux de confiance et copilote investisseur.

Monorepo **TypeScript** — pnpm workspaces + Turborepo — déployé sur **Google Cloud Run** avec une architecture **event-driven** (Pub/Sub).

> **État actuel** : le squelette complet est en place (38 workspaces, configurations, dépendances installées). Les fichiers source sont des placeholders vides à implémenter. Les fichiers `.gitkeep` servent uniquement à versionner les dossiers vides — ils disparaîtront au fur et à mesure de l'implémentation.

---

## Sommaire

- [Principes d'architecture](#principes-darchitecture)
- [Arborescence générale](#arborescence-générale)
- [Fichiers racine](#fichiers-racine)
- [La chaîne de configuration TypeScript](#la-chaîne-de-configuration-typescript)
- [Apps frontend (Next.js)](#apps-frontend-nextjs)
- [Apps backend (NestJS + Fastify)](#apps-backend-nestjs--fastify)
- [Anatomie d'un module DDD](#anatomie-dun-module-ddd--exemple-agent-investor-confidence)
- [Packages partagés](#packages-partagés)
- [Graphe de dépendances entre workspaces](#graphe-de-dépendances-entre-workspaces)
- [Contrats d'événements](#contrats-dévénements-packagesevents)
- [Infrastructure](#infrastructure-infra)
- [Tooling, docs et CI](#tooling-docs-et-ci)
- [Démarrage](#démarrage)

---

## Principes d'architecture

1. **Event-driven** — les services communiquent par événements Pub/Sub typés (schémas Zod versionnés dans `@fundos/events`), jamais par appel direct entre apps.
2. **Une app = un service Cloud Run** — chaque dossier `apps/*` est déployable indépendamment, avec son propre Dockerfile.
3. **Code partagé uniquement via `packages/*`** — une app n'importe **jamais** une autre app.
4. **Privacy by design** — consentement et visibilité vérifiés (compliance-service) avant tout usage de données investisseur.
5. **DDD en couches** — chaque service backend sépare `domain` / `application` / `infrastructure` / `presentation`.

```text
web-founder │ web-investor │ web-admin        (Next.js)
        └────────────┬────────────┘
                     ▼ HTTPS
               api-gateway                    (NestJS + Fastify)
                     │
   ┌─────────────────┼──────────────────┐
   ▼                 ▼                  ▼
services métier   orchestrator      investor-service
(campaign,        + agents IA
 compliance,      (agent-*)
 settlement,         │
 notification)       │
   └────── Pub/Sub ──┴── (topics + schémas Zod versionnés)
                     │
   PostgreSQL │ Redis │ BigQuery │ Vertex AI / GCS
```

## Arborescence générale

```text
fundos/
├─ apps/                        # 19 applications déployables
│  ├─ web-founder/              # Front Next.js — porteurs de projets
│  ├─ web-investor/             # Front Next.js — investisseurs
│  ├─ web-admin/                # Front Next.js — console ops/compliance
│  ├─ api-gateway/              # Point d'entrée public (auth, rate limit, routage)
│  ├─ orchestrator/             # Coordination des pipelines multi-agents
│  ├─ agent-ingestion/          # Parsing docs, CSV, OCR, extraction
│  ├─ agent-profile/            # Normalisation des profils founder/investor
│  ├─ agent-matching/           # Matching embeddings + ranking (Vector Search)
│  ├─ agent-market-research/    # Études de marché automatisées
│  ├─ agent-scoring/            # Scores business / market / risk / readiness
│  ├─ agent-recommendation/     # Actions recommandées
│  ├─ agent-investor-confidence/# Signal de confiance par projet (event-driven)
│  ├─ agent-investor-copilot/   # Notes lisibles côté investisseur + disclaimers
│  ├─ campaign-service/         # Création/gestion des campagnes
│  ├─ compliance-service/       # KYC/KYB, consentements, règles juridiction
│  ├─ investor-service/         # API investisseur (expose les signaux filtrés)
│  ├─ notification-service/     # Email, SMS, WhatsApp, webhooks
│  ├─ onchain-listener/         # Écoute blockchain / smart contracts
│  └─ settlement-service/       # Contributions fiat/on-chain, payouts
│
├─ packages/                    # 19 bibliothèques partagées (@fundos/*)
│  ├─ ui/                       # Composants React (Radix, CVA)
│  ├─ design-system/            # Tokens, thèmes Tailwind
│  ├─ types/                    # Types TS transverses
│  ├─ validation/               # Schémas Zod des DTO
│  ├─ sdk/                      # Client typé consommé par les frontends
│  ├─ database/                 # Prisma : schéma, client, seed
│  ├─ redis/                    # Cache, locks, files BullMQ
│  ├─ events/                   # Contrats Pub/Sub (topics + schémas)
│  ├─ auth/                     # JWT, RBAC, TOTP
│  ├─ ai/                       # Abstraction Vertex AI/OpenAI, prompts
│  ├─ vector-search/            # Clients Vertex AI Vector Search
│  ├─ analytics/                # Écritures BigQuery
│  ├─ blockchain/               # ABI, clients viem/ethers
│  ├─ market-data/              # Normalisation données de marché
│  ├─ logger/                   # Pino structuré JSON
│  ├─ config/                   # Validation d'environnement (Zod)
│  ├─ testing/                  # Fixtures, mocks
│  ├─ tsconfig/                 # Presets TypeScript partagés
│  └─ eslint-config/            # Règles ESLint complémentaires
│
├─ infra/                       # Terraform, Docker, scripts d'exploitation
├─ tooling/                     # Générateurs, codemods, helpers CI
├─ docs/                        # Architecture, ADR, API, runbooks, sécurité
├─ .github/workflows/           # CI/CD GitHub Actions
└─ (fichiers racine)            # Voir section suivante
```

## Fichiers racine

| Fichier | Rôle | Relations |
| --- | --- | --- |
| [package.json](package.json) | Manifeste racine : scripts globaux (`dev`, `build`, `check`…), devDependencies d'outillage (turbo, biome, husky, commitlint), config lint-staged, `packageManager` (pnpm 10) | Les scripts délèguent tous à `turbo run <tâche>` ; `prepare: husky` installe les hooks git à l'installation |
| [pnpm-workspace.yaml](pnpm-workspace.yaml) | Déclare les workspaces (`apps/*`, `packages/*`) et `onlyBuiltDependencies` (dépendances natives autorisées à exécuter leurs scripts de build : Prisma, esbuild, bcrypt…) | C'est ce fichier qui fait exister les références `workspace:*` dans les package.json |
| [turbo.json](turbo.json) | Pipeline de tâches Turborepo : `build` (dépend de `^build` = build des dépendances d'abord), `dev` (persistant, non caché), `lint`, `typecheck`, `test`, `test:e2e`, `clean` ; déclare les sorties cachées (`dist/`, `.next/`) | Chaque tâche correspond à un script du même nom dans **chaque** package.json de workspace ; `globalDependencies` invalide le cache si `.env` ou `tsconfig.base.json` changent |
| [tsconfig.base.json](tsconfig.base.json) | Options TypeScript strictes communes : `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`… | Sommet de la chaîne d'héritage TS (voir [section dédiée](#la-chaîne-de-configuration-typescript)) |
| [biome.json](biome.json) | Lint + format (indentation, quotes, ignore `dist/`, `.next/`…) | Utilisé par le script `lint` de chaque workspace et par lint-staged au pre-commit |
| [commitlint.config.ts](commitlint.config.ts) | Impose les Conventional Commits | Exécuté par le hook husky `commit-msg` |
| [.npmrc](.npmrc) | `engine-strict` (Node ≥ 22 obligatoire), `auto-install-peers` | Lu par pnpm à chaque install |
| [.env.example](.env.example) | Modèle des variables d'environnement (DATABASE_URL, REDIS_URL, GCP_*, JWT_*, SENTRY_DSN, RPC_URL…) | À copier en `.env` (ignoré par git) ; validé au boot par `@fundos/config` |
| [.gitignore](.gitignore) | Exclut `node_modules/`, `dist/`, `.next/`, `.turbo/`, `.env*` (sauf `.env.example`), rapports de test | — |
| `pnpm-lock.yaml` | Verrouillage exact des 1 194 dépendances | Généré par pnpm — ne jamais éditer à la main |

## La chaîne de configuration TypeScript

Les presets vivent dans [packages/tsconfig/](packages/tsconfig/) et héritent tous du fichier racine :

```text
tsconfig.base.json (racine — règles strictes communes)
        ▲
packages/tsconfig/base.json (relais)
        ▲
        ├─ packages/tsconfig/nestjs.json        # + decorators, CommonJS
        │        ▲
        │        └─ apps/<backend>/tsconfig.json
        ├─ packages/tsconfig/nextjs.json        # + JSX preserve, Bundler, noEmit
        │        ▲
        │        └─ apps/web-*/tsconfig.json
        └─ packages/tsconfig/react-library.json # + JSX react-jsx (libs React)
                 ▲
                 ├─ packages/ui/tsconfig.json
                 └─ packages/design-system/tsconfig.json
                 (les autres packages étendent base.json directement)
```

| Fichier | Rôle |
| --- | --- |
| [packages/tsconfig/package.json](packages/tsconfig/package.json) | Publie les 4 presets dans le workspace (`@fundos/tsconfig`) |
| [packages/tsconfig/base.json](packages/tsconfig/base.json) | Relais vers `tsconfig.base.json` racine |
| [packages/tsconfig/nestjs.json](packages/tsconfig/nestjs.json) | Active `experimentalDecorators` + `emitDecoratorMetadata` (requis NestJS), module CommonJS |
| [packages/tsconfig/nextjs.json](packages/tsconfig/nextjs.json) | `jsx: preserve`, résolution Bundler, `noEmit` (Next compile lui-même) |
| [packages/tsconfig/react-library.json](packages/tsconfig/react-library.json) | `jsx: react-jsx` pour les bibliothèques de composants |

## Apps frontend (Next.js)

`web-founder`, `web-investor` et `web-admin` partagent exactement la même structure :

```text
apps/web-<audience>/
├─ package.json            # Nom @fundos/web-*, deps Next 15/React 19 + workspace
├─ tsconfig.json           # Étend packages/tsconfig/nextjs.json, alias @/* → src/*
├─ next.config.ts          # Config Next.js (vide — à implémenter)
├─ postcss.config.mjs      # Branche @tailwindcss/postcss (Tailwind 4)
├─ playwright.config.ts    # Config des tests e2e (cible le dossier e2e/)
├─ Dockerfile              # Image Cloud Run (base : infra/docker/base-node.Dockerfile)
├─ .env.example            # Variables propres à cette app (NEXT_PUBLIC_*)
├─ public/                 # Assets statiques servis tels quels
├─ e2e/                    # Tests Playwright (script test:e2e)
└─ src/
   ├─ middleware.ts        # Middleware Next (auth, redirections) — s'exécute avant chaque requête
   ├─ app/
   │  ├─ layout.tsx        # Layout racine : providers (TanStack Query, thème), fonts
   │  ├─ page.tsx          # Page d'accueil de l'app
   │  └─ globals.css       # Point d'entrée Tailwind + styles globaux
   ├─ components/          # Composants spécifiques à CETTE app
   │                       # (les composants réutilisables vont dans @fundos/ui)
   ├─ hooks/               # Hooks React spécifiques à l'app
   └─ lib/                 # Utilitaires : instance du client @fundos/sdk, helpers
```

**Relations clés**

- `src/lib/` instancie le client `@fundos/sdk` → toutes les requêtes passent par **api-gateway** (jamais d'appel direct à un service interne).
- `layout.tsx` consomme `@fundos/design-system` (thème, tokens) et `@fundos/ui` (composants).
- Les formulaires valident avec les schémas `@fundos/validation` — **les mêmes schémas Zod que le backend**, ce qui garantit la cohérence des contrats.
- `tsconfig.json` → `packages/tsconfig/nextjs.json` → `tsconfig.base.json`.

| Dépendance workspace | Usage côté front |
| --- | --- |
| `@fundos/ui` | Composants partagés (boutons, dialogs, selects…) |
| `@fundos/design-system` | Tokens, thèmes |
| `@fundos/sdk` | Client API typé |
| `@fundos/types` | Types partagés avec le backend |
| `@fundos/validation` | Schémas Zod des formulaires/DTO |

## Apps backend (NestJS + Fastify)

Les 16 backends (`api-gateway`, `orchestrator`, `agent-*`, `*-service`, `onchain-listener`) partagent le même squelette :

```text
apps/<service>/
├─ package.json            # Template NestJS+Fastify commun + extras spécifiques (voir tableau)
├─ tsconfig.json           # Étend packages/tsconfig/nestjs.json
├─ Dockerfile              # Image Cloud Run du service
├─ .env.example            # Variables propres au service
├─ test/                   # Tests d'intégration (Supertest)
└─ src/
   ├─ main.ts              # Bootstrap : NestFactory + FastifyAdapter, helmet, CORS,
   │                       # compression, rate-limit, Swagger, OpenTelemetry, /health/*
   ├─ app.module.ts        # Module racine : assemble config/, common/ et modules/
   ├─ config/              # Chargement + validation env (via @fundos/config)
   ├─ common/
   │  ├─ guards/           # Auth JWT, RBAC (s'appuient sur @fundos/auth)
   │  ├─ interceptors/     # Logging corrélé, timing, transformation de réponses
   │  ├─ filters/          # Filtres d'exceptions globaux (format d'erreur uniforme)
   │  └─ utils/            # Helpers internes au service
   └─ modules/<domaine>/   # Modules métier en couches DDD (voir section suivante)
```

**Cycle d'exécution** : `main.ts` démarre l'app → `app.module.ts` importe les modules métier → les guards/interceptors/filters de `common/` sont appliqués globalement → chaque module expose des controllers HTTP et/ou des subscribers Pub/Sub.

**Dépendances communes à tous les backends** : `@fundos/auth`, `@fundos/config`, `@fundos/database`, `@fundos/events`, `@fundos/logger`, `@fundos/redis`, `@fundos/types`, `@fundos/validation` + NestJS 11, Fastify 5, Prisma client, Pub/Sub, OpenTelemetry, Sentry.

**Extras par service** :

| Service | Dépendances supplémentaires | Pourquoi |
| --- | --- | --- |
| `orchestrator`, `agent-ingestion`, `agent-profile`, `agent-matching`, `agent-recommendation` | `@fundos/ai`, `@fundos/vector-search` | Appels LLM + recherche vectorielle |
| `agent-market-research` | + `@fundos/market-data` | Normalisation des données de marché |
| `agent-scoring` | + `@fundos/analytics`, BigQuery | Écriture des scores dans BigQuery |
| `agent-investor-confidence` | `@fundos/ai`, `@fundos/analytics` | Résumé narratif + analytics |
| `agent-investor-copilot` | `@fundos/ai`, `@fundos/vector-search` | Génération de notes lisibles |
| `notification-service` | `bullmq` | Files locales d'envoi |
| `onchain-listener`, `settlement-service` | `@fundos/blockchain`, `viem` | Interaction blockchain |

## Anatomie d'un module DDD — exemple `agent-investor-confidence`

Le module [confidence/](apps/agent-investor-confidence/src/modules/confidence/) est le plus détaillé du repo : chaque fichier correspond à une étape du flux « investissement confirmé → signal de confiance ». Les couches ne se traversent que dans un sens : `presentation → application → domain`, et `infrastructure` implémente les interfaces du domaine.

```text
modules/confidence/
├─ domain/                          # Métier pur — aucune dépendance technique
│  ├─ entities/
│  │  └─ project-confidence-signal.entity.ts   # L'agrégat central : le signal d'un projet
│  ├─ value-objects/
│  │  ├─ confidence-score.vo.ts                # Score borné, immuable, auto-validé
│  │  └─ signal-intensity.vo.ts                # Intensité du signal (faible/moyen/élevé)
│  └─ services/
│     ├─ confidence-calculator.service.ts      # Étape 5 : calcule score, intensité,
│     │                                        # lead investor, fourchette de capital
│     └─ privacy-filter.service.ts             # Étape 4 : filtre consentement, visibilité,
│                                              # seuil d'agrégation, règles pays
├─ application/                     # Orchestration des cas d'usage (CQRS)
│  ├─ commands/
│  │  └─ recompute-confidence-signal.command.ts # Intention : "recalcule le signal du projet X"
│  ├─ handlers/
│  │  └─ investment-settled.handler.ts          # Étape 2-3 : reçoit l'événement, charge les
│  │                                            # données, enchaîne filtre → calcul → persistance
│  ├─ queries/                                  # Lectures (ex. dernier signal d'un projet)
│  └─ dto/
│     └─ confidence-signal.dto.ts               # Forme de sortie exposée aux consommateurs
├─ infrastructure/                  # Seule couche qui touche le monde extérieur
│  ├─ repositories/
│  │  └─ confidence-signal.repository.ts        # Étape 6 : persiste dans la table
│  │                                            # project_confidence_signals (Prisma)
│  ├─ persistence/                              # Mappers entité ↔ ligne Prisma
│  ├─ compliance-client/
│  │  └─ consent-policy.client.ts               # Lit visibility_level + investor_consents
│  │                                            # auprès du compliance-service
│  ├─ scoring-client/
│  │  └─ project-score.client.ts                # Lit le project_score (l'agent ENRICHIT le
│  │                                            # scoring, il ne le remplace pas)
│  └─ pubsub/
│     └─ confidence-events.publisher.ts         # Étape 6 : publie confidence.generated
└─ presentation/                    # Points d'entrée
   ├─ controllers/                              # Endpoints HTTP internes (debug, replay)
   └─ subscribers/
      └─ settlement-events.subscriber.ts        # Étape 1 : consomme investment_settled
                                                # depuis topic.settlement.events
```

**Chaîne d'exécution complète** :

```text
settlement-service publie investment_settled (schéma : @fundos/events)
  → settlement-events.subscriber.ts          (presentation)
  → investment-settled.handler.ts            (application)
       ├─ consent-policy.client.ts           (infrastructure → compliance-service)
       ├─ project-score.client.ts            (infrastructure → agent-scoring)
       ├─ privacy-filter.service.ts          (domain)
       ├─ confidence-calculator.service.ts   (domain)
       ├─ confidence-signal.repository.ts    (infrastructure → PostgreSQL)
       └─ confidence-events.publisher.ts     (infrastructure → Pub/Sub)
  → confidence.generated consommé par :
       investor-service, agent-investor-copilot, notification-service, analytics
```

Les deux autres modules détaillés suivent le même patron :

| Module | Fichiers clés | Rôle |
| --- | --- | --- |
| [agent-investor-copilot — copilot/](apps/agent-investor-copilot/src/modules/copilot/) | `signal-narrative.service.ts` (résumé lisible : « signal élevé », « lead investor présent »…), `disclaimer.service.ts` (mentions légales obligatoires), `get-project-insight.query.ts`, `confidence-events.subscriber.ts` | Transforme le signal brut en note compréhensible côté investisseur |
| [investor-service — investors/](apps/investor-service/src/modules/investors/) | `confidence-signals.controller.ts` | Expose les signaux **déjà filtrés** à l'UI via api-gateway |
| [agent-matching — matching/](apps/agent-matching/src/modules/matching/) | Couches DDD complètes + `infrastructure/vector-search/` | Matching embeddings founder ↔ investor |

## Packages partagés

Tous les packages suivent le même squelette : `package.json` (build tsup ESM+CJS avec déclarations de types), `tsconfig.json`, et `src/index.ts` comme **point d'entrée unique** (tout ce qui est exporté par le package passe par ce fichier).

| Package | Fichiers spécifiques | Rôle et relations |
| --- | --- | --- |
| [ui/](packages/ui/) | `src/components/` (composants), `src/lib/` (helpers cn/cva) | Composants React partagés. React en **peerDependency** (fourni par l'app hôte). Consommé par les 3 fronts |
| [design-system/](packages/design-system/) | `src/tokens/`, `src/themes/` | Couleurs, espacements, thèmes clair/sombre. Consommé par les fronts et par `ui` |
| [types/](packages/types/) | — | Types transverses (User, Project, Investment…). Aucune dépendance — importable partout, y compris dans `domain/` |
| [validation/](packages/validation/) | — | Schémas Zod des DTO. Partagé front (formulaires) **et** back (validation d'entrée) — source unique de vérité des contrats |
| [sdk/](packages/sdk/) | — | Client API typé pour les frontends. Dépend de `types` + `validation` ; ne parle qu'à api-gateway |
| [database/](packages/database/) | `prisma/schema.prisma` (modèles : campagnes, investissements, `project_confidence_signals`…), `prisma/seed.ts` (données de dev) | Le schéma génère `@prisma/client` ; tous les backends accèdent à PostgreSQL via ce package, jamais en direct |
| [redis/](packages/redis/) | — | Client ioredis configuré, locks distribués, files BullMQ |
| [events/](packages/events/) | `src/topics.ts` (noms des topics), `src/schemas/*.events.ts` | **Contrats Pub/Sub** — voir [section dédiée](#contrats-dévénements-packagesevents) |
| [auth/](packages/auth/) | — | Signature/vérification JWT (jose), RBAC (founder/investor/admin/compliance), TOTP (otplib). Utilisé par les guards de chaque backend |
| [ai/](packages/ai/) | `src/prompts/` (prompts versionnés), `src/embeddings/` | Abstraction Vertex AI/OpenAI : retry (p-retry), parallélisme (p-limit), cache (lru-cache). **Évite le vendor lock** : les agents n'importent jamais un SDK LLM directement |
| [vector-search/](packages/vector-search/) | — | Clients index/query Vertex AI Vector Search (utilisé par `agent-matching`, copilot) |
| [analytics/](packages/analytics/) | — | Écritures BigQuery (scores, cohortes, événements produits) |
| [blockchain/](packages/blockchain/) | `src/abi/` (ABI des smart contracts) | Clients viem/ethers. Utilisé par `onchain-listener` et `settlement-service` |
| [market-data/](packages/market-data/) | — | Normalisation des données de marché pour `agent-market-research` |
| [logger/](packages/logger/) | — | Pino JSON structuré : `requestId`, `userId`, `traceId` sur chaque ligne — corrélé aux traces OpenTelemetry |
| [config/](packages/config/) | — | Validation Zod des variables d'environnement **au boot** : un service avec une config invalide refuse de démarrer |
| [testing/](packages/testing/) | `src/fixtures/`, `src/mocks/` | Données et doubles de test partagés entre services |
| [tsconfig/](packages/tsconfig/) | `base.json`, `nestjs.json`, `nextjs.json`, `react-library.json` | Presets TS — voir [la chaîne de configuration](#la-chaîne-de-configuration-typescript) |
| [eslint-config/](packages/eslint-config/) | `index.js` | Règles ESLint type-aware complémentaires à Biome |

## Graphe de dépendances entre workspaces

```text
                    types ◄────────── (dépendance de presque tout)
                      ▲
        validation ───┘        sdk ──► types + validation
            ▲                   ▲
            │                   │
   ┌────────┴───────┐   web-founder / web-investor / web-admin
   │  tous les       │          │
   │  backends       │          └──► ui ──► (peer: react)
   │                 │          └──► design-system
   │  + auth         │
   │  + config       │   agents IA ──► ai, vector-search
   │  + database     │   agent-scoring ──► analytics
   │  + events       │   agent-market-research ──► market-data
   │  + logger       │   onchain-listener / settlement ──► blockchain
   │  + redis        │   notification-service ──► (bullmq)
   └─────────────────┘
```

Règles d'import :

- `apps/*` → `packages/*` : ✅ (c'est le seul sens autorisé)
- `apps/*` → `apps/*` : ❌ jamais (communication par événements ou via api-gateway)
- `packages/*` → `packages/*` : ✅ avec parcimonie (`sdk → types`, `ui → design-system`)
- `domain/` d'un service → uniquement des packages purs (`types`, `validation`)

## Contrats d'événements (`packages/events`)

| Fichier | Rôle |
| --- | --- |
| [src/topics.ts](packages/events/src/topics.ts) | Noms canoniques des topics Pub/Sub (ex. `topic.settlement.events`) — une seule source de vérité, pas de strings en dur dans les services |
| [src/schemas/settlement.events.ts](packages/events/src/schemas/settlement.events.ts) | Schéma de `investment_settled` — produit par `settlement-service`, consommé par `agent-investor-confidence` et analytics |
| [src/schemas/confidence.events.ts](packages/events/src/schemas/confidence.events.ts) | Schéma de `confidence.generated` — produit par `agent-investor-confidence`, consommé par `investor-service`, `agent-investor-copilot`, `notification-service` |
| [src/schemas/scoring.events.ts](packages/events/src/schemas/scoring.events.ts) | Schéma de `project_signal_updated` — permet à `agent-scoring` de fusionner score projet et score de confiance en note finale |

Règles : producteur et consommateurs importent **le même schéma Zod** ; chaque enveloppe porte un champ `version` ; les subscribers sont idempotents (un événement rejoué ne duplique aucun effet).

## Infrastructure (`infra/`)

```text
infra/
├─ terraform/
│  ├─ environments/           # 1 dossier = 1 environnement avec son propre état
│  │  ├─ dev/
│  │  ├─ staging/
│  │  └─ prod/
│  │     ├─ main.tf           # Compose les modules pour cet environnement
│  │     ├─ variables.tf      # Variables d'entrée (projet GCP, région…)
│  │     └─ backend.tf        # Stockage de l'état Terraform (bucket GCS)
│  └─ modules/                # Modules réutilisables — chacun : main.tf / variables.tf / outputs.tf
│     ├─ cloud-run-service/   # Déploie une app apps/* en service Cloud Run
│     ├─ pubsub-topic/        # Topic + souscriptions + dead-letter
│     ├─ sql-postgres/        # Instance Cloud SQL PostgreSQL
│     ├─ redis/               # Instance Memorystore
│     ├─ gcs-bucket/          # Buckets (pitch decks, exports)
│     ├─ bigquery/            # Datasets analytics
│     ├─ monitoring/          # Alertes, dashboards, uptime checks
│     └─ secrets/             # Secret Manager (JWT, DSN, clés API)
├─ docker/
│  ├─ base-node.Dockerfile    # Image de base Node 22 commune (couches partagées)
│  └─ service.Dockerfile      # Template multi-stage : build tsup → image minimale
└─ scripts/                   # Scripts d'exploitation (migrations, backfills…)
```

**Relation apps ↔ infra** : chaque app possède son `Dockerfile` (construit sur `base-node.Dockerfile`) et est provisionnée par une instance du module `cloud-run-service` dans chaque environnement. Les topics référencés dans `packages/events/src/topics.ts` sont créés par le module `pubsub-topic`.

## Tooling, docs et CI

| Emplacement | Rôle |
| --- | --- |
| [tooling/generators/](tooling/generators/) | Scaffolding : générer une nouvelle app ou un nouveau package conforme aux templates |
| [tooling/codemods/](tooling/codemods/) | Migrations de code automatisées à grande échelle |
| [tooling/ci/](tooling/ci/) | Scripts utilisés par les workflows GitHub Actions |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | Pipeline CI : install → lint → typecheck → test → build (avec cache Turborepo) |
| [.github/workflows/deploy.yml](.github/workflows/deploy.yml) | Déploiement : build des images → push → Cloud Run par environnement |
| [docs/architecture/](docs/architecture/) | Schémas et docs d'architecture (dont `investor-confidence-agent.md`) |
| [docs/adr/](docs/adr/) | Architecture Decision Records (`0001-investor-confidence-agent-placement.md`) |
| [docs/api/](docs/api/) | Contrats OpenAPI exportés depuis Swagger |
| [docs/runbooks/](docs/runbooks/) | Procédures d'exploitation (incidents, rollbacks) |
| [docs/security/](docs/security/) | Politiques de sécurité et de privacy |

## Démarrage

Prérequis : **Node.js ≥ 22**, **pnpm 10** (`npm i -g pnpm@10`), Docker (PostgreSQL et Redis locaux).

```bash
pnpm install            # Installe les 38 workspaces
cp .env.example .env    # Puis renseigner les variables
pnpm dev                # Lance toutes les apps en mode dev (Turbo)
```

| Commande | Description |
| --- | --- |
| `pnpm dev` | Toutes les apps en mode dev (parallèle) |
| `pnpm build` | Build complet avec cache Turborepo |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` | Qualité, types, tests unitaires |
| `pnpm test:e2e` | Tests end-to-end Playwright |
| `pnpm check` | lint + typecheck + test |
| `pnpm format` | Formatage Biome (`--write`) |
| `pnpm clean` | Nettoie les artefacts de build |

Cibler un seul workspace :

```bash
pnpm --filter @fundos/api-gateway dev
pnpm --filter @fundos/web-investor build
```
