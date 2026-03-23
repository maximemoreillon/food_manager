# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run generate   # Static site generation
npm run preview    # Preview production build
```

No test or lint scripts are configured.

## Architecture

**Nuxt 4 full-stack application** — calorie/macronutrient tracker with food management, meal plans, AI label parsing, and image storage.

### Stack
- **UI:** Vue 3 + Vuetify 3 (Material Design)
- **Database:** MongoDB via `nuxt-mongoose`
- **Storage:** MinIO (S3-compatible) via `minio` + `sharp` for image resizing
- **Auth:** OIDC (Keycloak) via `nuxt-auth-utils`
- **AI:** OpenAI GPT-4o-mini for nutrition label parsing from food images

### Directory structure
- `pages/(authenticated)/` — all protected pages (foods, meal_plans, settings); route group enforces auth
- `pages/login.vue` — public login page
- `server/api/` — H3 event handlers for REST API
- `server/models/` — Mongoose models: `Food`, `MealPlan`, `UserConfiguration`
- `components/food/` — food-specific components
- `components/mealPlan/` — meal plan components
- `middleware/auth.global.ts` — redirects unauthenticated users to `/login`

### Authentication
All routes except `/login` and `/auth/*` are protected by `middleware/auth.global.ts`. OIDC flow goes through `/auth/oidc`. Session managed via `useUserSession()` composable. API routes extract the user via `getUserId(event)` (reads `user.legacy_id` or `user.sub` from session), throwing 401 if not authenticated.

### API pattern
API routes at `server/api/` follow REST conventions. All routes require authentication. Query params are validated with Zod. Foods support pagination, sorting, search, and hidden filtering. MealPlan model uses Mongoose virtuals to compute total calories/macros from embedded foods.

### Environment variables
```
NUXT_MONGOOSE_URI              # MongoDB connection string
S3_ENDPOINT                    # MinIO/S3 endpoint
S3_PORT                        # Storage port (9000 for MinIO)
S3_BUCKET                      # Bucket name
S3_ACCESS_KEY_ID               # Storage credentials
S3_SECRET_ACCESS_KEY
NUXT_OAUTH_OIDC_OPENID_CONFIG  # OIDC discovery URL (Keycloak)
NUXT_OAUTH_OIDC_CLIENT_ID      # OIDC client ID
NUXT_OAUTH_OIDC_CLIENT_SECRET  # OIDC client secret
OPENAI_API_KEY                 # For nutrition label parsing
```

### Deployment
Multi-stage Docker build (Node 22-alpine), deployed to Kubernetes via GitLab CI. ExternalSecrets syncs credentials from Vault every 5 minutes. Ingress hostname: `food.home.maximemoreillon.com`.
