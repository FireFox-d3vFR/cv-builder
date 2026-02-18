FROM node:20-bookworm-slim
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate --schema=/app/prisma/schema.prisma

EXPOSE 4001
# Lance directement Node en PID 1 pour recevoir SIGTERM/SIGINT proprement.
CMD ["node", "src/server.js"]
