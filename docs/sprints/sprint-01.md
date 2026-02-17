# Sprint 01 - Foundation Backend

## Objectif

Structurer proprement `profile-service` selon la convention `1 use-case = 1 fichier`, et stabiliser les endpoints de base.

## Durée

1 semaine (ou 2-3 sessions perso).

## Scope

- Refactor de `src/server.js` en modules:
  - `src/db/prismaClient.js`
  - `src/routes/healthRoutes.js`
  - `src/routes/profileRoutes.js`
  - `src/use-cases/createProfile.js`
  - `src/use-cases/listProfiles.js`
- Ajouter endpoint `GET /profiles`
- Validation minimale des payloads
- Logs d’erreur API propres
- Vérification via tests manuels HTTP

## User stories

- En tant qu’utilisateur, je peux créer un profil (`POST /profiles`).
- En tant qu’utilisateur, je peux lister les profils (`GET /profiles`).
- En tant que dev, je peux lancer tout le projet avec une seule commande Docker Compose.

## Definition of Done

- `docker compose up -d --build` fonctionne
- `prisma db push` fonctionne sans erreur
- `GET /health` retourne 200
- `POST /profiles` retourne 201 avec objet créé
- `GET /profiles` retourne une liste JSON
- Le code respecte `1 use-case métier = 1 fichier`

## Commandes utiles

```bash
docker compose up -d --build
docker compose exec profile-service npx prisma db push --schema=/app/prisma/schema.prisma
docker compose logs profile-service --tail=100
```

## Risques identifiés

- Régression Prisma si image Docker modifiée sans OpenSSL
- Mismatch credential Postgres / DATABASE_URL
- Confusion chemins host vs conteneur

## Backlog suivant (Sprint 02)

- Modèles Prisma: `Experience`, `Education`, `Skill`
- Endpoints CRUD par section
- Début normalisation `packages/schemas`