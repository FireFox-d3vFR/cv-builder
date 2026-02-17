# CV Builder

Application pour créer un CV/Portfolio modulaire (type éditeur par sections), avec rendu automatique selon des templates.

## Vision du projet

Construire une plateforme complète (web + API + DB, puis mobile) pour :
- saisir des informations via des modules/formulaires
- générer des sections standardisées (expérience, formation, compétences, etc.)
- prévisualiser un CV/Portfolio stylé
- publier/exporter le résultat

## Stack technique

Stack déjà en place:
- Frontend web: Next.js (React)
- Backend API: Express.js
- ORM: Prisma
- Base de données: PostgreSQL
- Orchestration locale: Docker Compose
- Runtime conteneurs: Docker Desktop

Stack cible (prochaines étapes):
- Authentification: Clerck ou Auth.js
- Mobile/Web complémentaire: Expo
- Architecture: modular monolith évolutif vers microservices
- Qualité: ESLint + convention `1 use-case métier = 1 fichier`

## Arborescence actuelle

```txt
cv-builder/
  apps/
    web/
  services/
    profile-service/
  packages/
    schemas/
  docker-compose.yml
```

## Prérequis

- Docker Desktop
- Node.js + npm (pour édition locale éventuelle)

## Lancer le projet

Depuis la racine `cv-builder/`:

```bash
docker compose up -d --build
```

Vérifier les conteneurs:

```bash
docker compose ps
```

## Prisma (profile-service)

Appliquer le schéma en base:

```bash
docker compose exec profile-service npx prisma db push --schema=/app/prisma/schema.prisma
```

(Optionnel) Regénérer le client Prisma:

```bash
docker compose exec profile-service npx prisma generate --schema=/app/prisma/schema.prisma
```

## Endpoints disponibles

Health check:

```bash
GET http://localhost:4001/health
```

Créer un profil:

```bash
POST http://localhost:4001/profiles
Content-Type: application/json

{
  "fullName": "Jean Dupont",
  "title": "Dev Fullstack"
}
```

## Notes techniques importantes

- `profile-service` utilise `node:20-bookworm-slim` (compatibilité Prisma/OpenSSL).
- Le `Dockerfile` de `profile-service` exécute `prisma generate` au build.
- Les credentials Postgres doivent être alignés entre:
    - `service.postgres` (`POSTGRES_USER`, `POSTGRES_PASSWORD`)
    - `profile-service` (`DATABASE_URL`)
- En cas de mismatch credentials, reset volume DB:
```bash
docker compose down -v
docker compose up -d --build
```

## Convention de code

- 1 use-case métier = 1 fichier
- Fichiers courts, responsibilités explicites
- Validation d'entrée au plus proche des routes/use-cases

## Roadmap courte

- Sprint 1: refactor backend `profile-service` (routes/use-cases/db)
- Sprint 2: sections CV (experience, education, skills) + CRUD
- Sprint 3: authentification (Clerk/Auth.js)
- Sprint 4: éditeur de sections côté web
- Sprint 5: templates + preview + publication