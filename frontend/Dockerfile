# Frontend image for PsyLearn Profiler (build context = ./frontend)
# Multi-stage: build the Vite app with Node, then serve the static files with nginx.

# ---- build stage ---------------------------------------------------------- #
FROM node:20-alpine AS build
WORKDIR /app

# The API URL is baked in at build time (Vite env vars are compile-time).
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- serve stage ---------------------------------------------------------- #
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
