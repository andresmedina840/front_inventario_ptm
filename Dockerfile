# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependencias de construcción
RUN apk add --no-cache git python3 make g++

# Cachear dependencias
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copiar y construir aplicación
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copiar solo lo necesario
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public 

# Instalar solo producción
RUN npm ci --omit=dev --prefer-offline --no-audit

# Configuración de seguridad
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

EXPOSE 3000

CMD ["npm", "start"]