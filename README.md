# FundOS

Plateforme de financement mettant en relation porteurs de projets (founders) et investisseurs, pilotée par des agents IA : ingestion de documents, matching, scoring, études de marché, signaux de confiance et copilote investisseur.

Monorepo **TypeScript** — pnpm workspaces + Turborepo, déployé sur **Google Cloud Run** avec une architecture **event-driven** (Pub/Sub).

---

## Sommaire

- [Vue d'ensemble](#vue-densemble)
- [Stack technique](#stack-technique)
- [Structure du monorepo](#structure-du-monorepo)
- [Applications](#applications)
- [Packages partagés](#packages-partagés)
- [Architecture event-driven](#architecture-event-driven)
- [Flux : signal de confiance investisseur](#flux--signal-de-confiance-investisseur)
- [Architecture interne d'un service](#architecture-interne-dun-service)
- [Conventions et standards](#conventions-et-standards)
- [Infrastructure](#infrastructure)
- [Démarrage](#démarrage)

---

## Vue d'ensemble

```text
                        ┌─────────────────────────────────────────┐
                        │              Frontends Next.js          │
                        │  web-founder │ web-investor │ web-admin │
                        └───────────────────┬─────────────────────┘
                                            │ HTTPS
                                            ▼
                                    ┌──────────────┐
                                    │  api-gateway │  NestJS + Fastify
                                    └──────┬───────┘
                       ┌───────────────────┼───────────────────────┐
                       ▼                   ▼                       ▼
              ┌─────────────────┐  ┌───────────────┐  ┌─────────────────────┐
              │ Services métier │  │  orchestrator │  │  investor-service   │
              │ campaign,       │  │       +       │  │                     │
              │ compliance,     │  │   agents IA   │  │                     │
              │ settlement,     │  │  (agent-*)    │  │                     │
              │ notification    │  └───────┬───────┘  └─────────────────────┘
              └────────┬────────┘          │
                       │     Pub/Sub (topics + schémas Zod versionnés)
                       └─────────────┬─────┘
                                     ▼
        ┌──────────────┬─────────────┬──────────────┬─────────────────────┐
        │  PostgreSQL  │    Redis    │   BigQuery   │  Vertex AI / Vector │
        │   (Prisma)   │ cache/locks │  analytics   │  Search / GCS       │
        └──────────────┴─────────────┴──────────────┴─────────────────────┘
```

Principes structurants :

1. **Event-driven** — les services communiquent par événements Pub/Sub, jamais par couplage direct entre apps.
2. **Agents IA comme services transverses** — déclenchés par événements, avec accès minimal aux données et audit systématique.
3. **Privacy by design** — consentement et niveau de visibilité vérifiés avant tout usage de données investisseur (compliance-service).
4. **Code partagé uniquement via `packages/*`** — une app n'importe jamais une autre app.

## Stack technique

| Couche | Choix | Rôle |
| --- | --- | --- |
| Monorepo | pnpm 10 + Turborepo 2 | Workspaces stricts, cache de build, orchestration CI |
| Frontends | Next.js 15 + React 19 | Apps produit (SSR, dashboards, auth) |
| Backend | NestJS 11 + adapter Fastify 5 | Architecture modulaire, performances proches de Fastify natif |
| ORM | Prisma 6 + PostgreSQL 16 | Données relationnelles : campagnes, investissements, audit |
| Cache / files | Redis 7 (ioredis, BullMQ) | Cache, locks distribués, rate limit, jobs locaux |
| Message bus | Google Pub/Sub | Coordination event-driven entre services Cloud Run |
| IA | Vertex AI (+ abstraction maison `packages/ai`) | LLM, embeddings, prompts |
| Recherche vectorielle | Vertex AI Vector Search | Moteur de matching founder ↔ investor |
| Analytics | BigQuery | Scoring, cohortes, dashboards |
| Fichiers | Google Cloud Storage | Pitch decks, CSV, exports |
| Blockchain | viem (ethers en secours) | Écoute on-chain, settlement |
| Validation | Zod + class-validator | Contrats API et schémas d'événements |
| State front | TanStack Query + Zustand | Server state / client state |
| UI | Tailwind CSS 4 + Radix + shadcn-style | Design system accessible |
| Qualité | Biome + commitlint + husky + lint-staged | Lint, format, conventions de commit |
| Tests | Vitest + Playwright + Supertest | Unitaire, e2e, intégration API |
| Observabilité | OpenTelemetry + Sentry + Cloud Logging | Traces, erreurs, logs corrélés |
| Infra | Terraform + Docker + Cloud Run | IaC multi-environnements (dev / staging / prod) |

## Structure du monorepo

```text
fundos/
├─ apps/                  # Applications déployables (1 app = 1 service Cloud Run)
│  ├─ web-*               # Frontends Next.js
│  ├─ api-gateway         # Point d'entrée public
│  ├─ orchestrator        # Coordination des agents
│  ├─ agent-*             # Agents IA event-driven
│  ├─ *-service           # Services métier
│  └─ onchain-listener    # Écoute blockchain
├─ packages/              # Code partagé (jamais déployé seul)
├─ infra/
│  ├─ terraform/          # environments/{dev,staging,prod} + modules réutilisables
│  ├─ docker/             # Dockerfiles de base
│  └─ scripts/
├─ tooling/               # Générateurs, codemods, helpers CI
├─ docs/                  # architecture/, adr/, api/, runbooks/, security/
├─ .github/workflows/     # CI/CD GitHub Actions
├─ turbo.json             # Pipeline de tâches (build, lint, test, typecheck)
├─ pnpm-workspace.yaml    # Workspaces + dépendances natives approuvées
├─ tsconfig.base.json     # Config TS stricte commune
└─ biome.json             # Lint + format
```

## Applications

### Frontends (Next.js)

| App | Audience | Description |
| --- | --- | --- |
| `web-founder` | Porteurs de projets | Création de campagnes, upload de documents, suivi |
| `web-investor` | Investisseurs | Découverte de projets, signaux de confiance, copilote |
| `web-admin` | Équipe interne | Console ops, compliance, support |

### Passerelle et orchestration

| App | Description |
| --- | --- |
| `api-gateway` | Point d'entrée public unique : auth, rate limiting, routage vers les services internes |
| `orchestrator` | Coordonne les pipelines multi-agents (ex. ingestion → profil → matching → scoring) |

### Agents IA (event-driven)

| Agent | Entrée | Sortie |
| --- | --- | --- |
| `agent-ingestion` | Documents, CSV, OCR | Données extraites et normalisées |
| `agent-profile` | Données brutes founder/investor | Profils normalisés |
| `agent-matching` | Profils + embeddings | Paires founder ↔ investor classées (Vector Search) |
| `agent-market-research` | Profil projet | Études de marché automatisées |
| `agent-scoring` | Données projet + marché | Scores business / market / risk / readiness |
| `agent-recommendation` | Scores + contexte | Actions recommandées |
| `agent-investor-confidence` | `investment_settled` | Signal de confiance par projet (voir [flux détaillé](#flux--signal-de-confiance-investisseur)) |
| `agent-investor-copilot` | `confidence.generated` | Notes lisibles côté investisseur, avec disclaimers |

### Services métier

| Service | Description |
| --- | --- |
| `campaign-service` | Création et gestion des campagnes de financement |
| `compliance-service` | KYC/KYB, consentements, niveaux de visibilité, règles par juridiction |
| `investor-service` | API investisseur : expose les signaux de confiance filtrés à l'UI |
| `notification-service` | Email, SMS, WhatsApp, webhooks (BullMQ pour les files locales) |
| `onchain-listener` | Écoute des événements blockchain / smart contracts (viem) |
| `settlement-service` | Traitement des contributions (fiat et on-chain) et des payouts |

## Packages partagés

| Package | Contenu |
| --- | --- |
| `@fundos/ui` | Composants React partagés (Radix, CVA, tailwind-merge) |
| `@fundos/design-system` | Tokens, thèmes, styles globaux Tailwind |
| `@fundos/types` | Types TypeScript transverses |
| `@fundos/validation` | Schémas Zod des DTO (partagés front/back) |
| `@fundos/sdk` | Client typé interne consommé par les frontends |
| `@fundos/database` | Schéma Prisma, client, seed, helpers |
| `@fundos/redis` | Client cache, locks distribués, files BullMQ |
| `@fundos/events` | **Contrats Pub/Sub** : `topics.ts` + `schemas/*.events.ts` (Zod versionnés) |
| `@fundos/auth` | JWT (jose), RBAC, guards, TOTP (otplib) |
| `@fundos/ai` | Abstraction Vertex AI / OpenAI : prompts, embeddings, retry, cache |
| `@fundos/vector-search` | Clients index/query Vertex AI Vector Search |
| `@fundos/analytics` | Écritures BigQuery, helpers de tracking |
| `@fundos/blockchain` | ABI, clients chain (viem/ethers), utilitaires on-chain |
| `@fundos/market-data` | Normalisation des données de marché |
| `@fundos/logger` | Pino structuré JSON (requestId, userId, traceId) |
| `@fundos/config` | Validation d'environnement au boot (Zod + dotenv) |
| `@fundos/testing` | Fixtures, mocks, utilitaires de test |
| `@fundos/tsconfig` | Presets TS : `base`, `nestjs`, `nextjs`, `react-library` |
| `@fundos/eslint-config` | Règles ESLint type-aware complémentaires à Biome |

## Architecture event-driven

Chaque événement Pub/Sub a un **schéma Zod versionné** dans [packages/events/src/schemas/](packages/events/src/schemas/) :

| Fichier | Événements | Producteur → Consommateurs |
| --- | --- | --- |
| `settlement.events.ts` | `investment_settled` | settlement-service → agent-investor-confidence, analytics |
| `confidence.events.ts` | `confidence.generated` | agent-investor-confidence → investor-service, agent-investor-copilot, notification-service |
| `scoring.events.ts` | `project_signal_updated` | agent-investor-confidence → agent-scoring (fusion en note finale) |

Règles :

- Producteurs et consommateurs importent le **même schéma** depuis `@fundos/events` — jamais de payload non typé.
- Tout changement de schéma est versionné (champ `version` dans l'enveloppe).
- Les souscriptions sont idempotentes : un événement rejoué ne doit pas dupliquer d'effets.

## Flux : signal de confiance investisseur

L'`agent-investor-confidence` est un **service transverse de confiance**, déclenché par événements — jamais de logique de confiance dans le front ni dans `investor-service`.

```text
settlement-service / project_investments
        ↓  investment_settled (topic.settlement.events)
agent-investor-confidence
        ↓  écrit project_confidence_signals + publie confidence.generated
investor-service / agent-investor-copilot
        ↓
UI investisseur (web-investor)
```

Déroulé (implémenté dans [apps/agent-investor-confidence/src/modules/confidence/](apps/agent-investor-confidence/src/modules/confidence/)) :

1. **Déclenchement** — `presentation/subscribers/settlement-events.subscriber.ts` consomme `investment_settled`.
2. **Chargement** — investissements du projet, consentements, performances agrégées des investisseurs, profil secteur/stade, policy de juridiction.
3. **Filtrage privacy/compliance** — `domain/services/privacy-filter.service.ts` applique : consentement (`investor_consents`), visibilité (`visibility_level`), nombre minimum d'investisseurs agrégés, règles pays. Les politiques sont lues via `infrastructure/compliance-client/`.
4. **Calcul** — `domain/services/confidence-calculator.service.ts` produit : score de confiance, intensité du signal, présence d'un lead investor, fourchette agrégée de capital, résumé narratif. Le score projet existant est lu via `infrastructure/scoring-client/` — l'agent **enrichit** le scoring, il ne le remplace pas.
5. **Persistance + publication** — écriture dans `project_confidence_signals`, puis publication de `confidence.generated` via `infrastructure/pubsub/`.
6. **Consommation** — `investor-service` (API), `agent-investor-copilot` (notes lisibles + disclaimers), `notification-service` (alertes informatives, jamais agressives), analytics (dashboards).

Garde-fous : consentement obligatoire, accès minimal aux données, audit de chaque signal généré, agrégation pour éviter toute ré-identification d'un investisseur individuel.

## Architecture interne d'un service

Chaque service backend suit la même organisation en couches (exemple : `agent-matching`) :

```text
src/
├─ main.ts                      # Bootstrap NestJS + Fastify
├─ app.module.ts
├─ modules/<domaine>/
│  ├─ domain/                   # Entités, value-objects, services métier purs
│  ├─ application/              # Commands, queries, handlers, DTO (CQRS)
│  ├─ infrastructure/           # Repositories, Pub/Sub, clients externes, persistance
│  └─ presentation/             # Controllers HTTP + subscribers d'événements
├─ common/                      # Guards, interceptors, filters, utils
└─ config/
```

- `domain/` ne dépend de rien d'autre que `packages/*` purs (types, validation).
- `infrastructure/` est le seul endroit qui touche Prisma, Pub/Sub ou des APIs externes.
- `presentation/` ne contient aucune logique métier.

## Conventions et standards

**Imports**

- Une app n'importe **jamais** une autre app — uniquement `packages/*`.
- Les frontends ne parlent qu'à `api-gateway` (via `@fundos/sdk`).

**TypeScript** ([tsconfig.base.json](tsconfig.base.json))

- `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`.
- Aucun `any` sans justification. DTO séparés des entités domaine.

**Sécurité**

- Validation d'environnement au boot (`@fundos/config`, Zod).
- Secrets via Secret Manager — jamais en clair dans le code ou les images.
- RBAC strict : `founder`, `investor`, `admin`, `compliance`.
- Rate limiting, helmet, rotation JWT, audit logs.

**Observabilité**

- Logs JSON structurés (pino) avec `requestId`, `userId`, `traceId`.
- Traces OpenTelemetry sur les requêtes critiques.
- Endpoints `/health/live` et `/health/ready` sur chaque service (requis Cloud Run).

**Performance Cloud Run**

- Bundling backend via tsup/esbuild pour réduire les cold starts.
- Lazy-load des dépendances lourdes au démarrage.
- `min-instances` en production sur les services critiques.

**Commits** — Conventional Commits, vérifiés par commitlint + husky.

## Infrastructure

```text
infra/terraform/
├─ environments/        # dev / staging / prod (état séparé par environnement)
└─ modules/             # cloud-run-service, pubsub-topic, sql-postgres, redis,
                        # gcs-bucket, bigquery, monitoring, secrets
```

- Chaque app `apps/*` correspond à un service Cloud Run provisionné par le module `cloud-run-service`.
- Les Dockerfiles partagent une base commune ([infra/docker/base-node.Dockerfile](infra/docker/base-node.Dockerfile)).
- CI/CD : GitHub Actions ([.github/workflows/](.github/workflows/)) + cache Turborepo + Cloud Build/Deploy.

## Démarrage

Prérequis : **Node.js ≥ 22**, **pnpm 10** (`npm i -g pnpm@10`), Docker (PostgreSQL et Redis locaux).

```bash
pnpm install            # Installe les 38 workspaces
cp .env.example .env    # Puis renseigner les variables
pnpm dev                # Lance toutes les apps en mode dev (Turbo)
```

### Commandes

| Commande | Description |
| --- | --- |
| `pnpm dev` | Toutes les apps en mode dev (parallèle) |
| `pnpm build` | Build complet avec cache Turborepo |
| `pnpm lint` | Lint Biome sur tous les workspaces |
| `pnpm typecheck` | Vérification TypeScript stricte |
| `pnpm test` | Tests unitaires (Vitest) |
| `pnpm test:e2e` | Tests end-to-end (Playwright) |
| `pnpm check` | lint + typecheck + test |
| `pnpm format` | Formatage Biome (`--write`) |
| `pnpm clean` | Nettoie les artefacts de build |

Cibler un seul workspace :

```bash
pnpm --filter @fundos/api-gateway dev
pnpm --filter @fundos/web-investor build
```

## Documentation

- [docs/architecture/](docs/architecture/) — schémas et décisions d'architecture
- [docs/adr/](docs/adr/) — Architecture Decision Records (ex. placement de l'agent de confiance)
- [docs/api/](docs/api/) — contrats OpenAPI
- [docs/runbooks/](docs/runbooks/) — procédures d'exploitation
- [docs/security/](docs/security/) — politiques de sécurité et privacy
