# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY frontend/package*.json ./
COPY docker/frontend/entrypoint.dev.sh /usr/local/bin/entrypoint.dev.sh
RUN chmod +x /usr/local/bin/entrypoint.dev.sh
RUN npm install
ENTRYPOINT ["entrypoint.dev.sh"]

FROM deps AS dev
EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "1000", "--allowed-hosts"]

FROM deps AS build
COPY frontend/ .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist/frontend ./dist/frontend
EXPOSE 4000
CMD ["node", "dist/frontend/server/server.mjs"]
