FROM node:22-alpine

WORKDIR /app
COPY package.json server.js ./

ENV PORT=8080 \
    APP_VERSION=v1
EXPOSE 8080

HEALTHCHECK --interval=5s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

USER node
CMD ["node", "server.js"]
