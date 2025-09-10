# car-note-main/frontend/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Ensure your app uses relative API like fetch('/api/...') to benefit from the reverse proxy below
RUN npm run build

FROM nginx:1.27-alpine
# Nginx config to serve SPA and proxy /api -> backend:8000
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
