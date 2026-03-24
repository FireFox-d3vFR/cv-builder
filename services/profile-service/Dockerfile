FROM node:20-bookworm-slim
WORKDIR /workspace

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY services/profile-service/package.json ./services/profile-service/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
RUN npm install

COPY services/profile-service ./services/profile-service
COPY packages/schemas ./packages/schemas
WORKDIR /workspace/services/profile-service

RUN npx prisma generate --schema=/workspace/services/profile-service/prisma/schema.prisma

EXPOSE 4001
# Lance directement Node en PID 1 pour recevoir SIGTERM/SIGINT proprement.
CMD ["node", "src/server.js"]
