# Etapa 1: build de la app Vite
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: servir los estáticos con Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copiamos el build de Vite
COPY --from=build /app/dist .

# Config SPA para manejar rutas de front
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
