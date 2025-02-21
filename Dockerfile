# Etapa de construcción
FROM node:18-alpine AS build

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos de package.json y package-lock.json a /app
COPY package*.json ./

# Instala las dependencias
RUN npm install --force

# Copia el resto de los archivos al directorio de trabajo en el contenedor
COPY . .

# Construye la aplicación Next.js
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el resultado de la compilación desde la etapa de construcción
COPY --from=build /app /app

# Exponer el puerto 3000
EXPOSE 3000

# Comando de inicio del contenedor para ejecutar la aplicación Next.js en producción
CMD ["npm", "run", "start"]
