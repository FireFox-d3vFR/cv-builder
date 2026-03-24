FROM node:20-alpine
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY services/profile-service/package.json ./services/profile-service/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
RUN npm install
COPY apps/web ./apps/web
COPY packages/schemas ./packages/schemas
WORKDIR /workspace/apps/web
EXPOSE 3000
CMD ["npm", "run", "dev", "-w", "@cv-builder/web"]
