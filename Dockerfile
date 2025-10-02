# syntax=docker/dockerfile:1

#############################################
# Build stage: install dependencies & bundle
#############################################
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies (prefers lockfile when available)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the rest of the project and build the production bundle
COPY . .
RUN npm run build

#############################################
# Runtime stage: serve static assets with Nginx
#############################################
FROM nginx:1.27-alpine AS runner

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
