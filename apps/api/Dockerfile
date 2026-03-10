FROM node:20-slim AS builder

WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter @my-project/api build
FROM node:20-slim AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json

ENV NODE_ENV=production

EXPOSE 3333

CMD ["node", "dist/main.js"]