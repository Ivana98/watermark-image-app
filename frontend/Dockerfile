# Use Node.js 22 as the base image for building the frontend
FROM node:22-alpine AS builder

# Set the environment variables needed for building the frontend
ARG VITE_BACKEND_APP_URL
ENV VITE_BACKEND_APP_URL=${VITE_BACKEND_APP_URL}

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for better caching
# COPY package.json package-lock.json ./ # Deleted package-lock.json because of Nexus Repository Manager
COPY package.json ./

# Install dependencies
# RUN npm ci --no-audit --no-fund # Works only with package-lock.json
RUN npm i --no-audit --no-fund
# Copy the rest of the application code
COPY . .

# Build the React app using Vite
ENV NODE_ENV=production
RUN npm run build

# Use a lightweight Nginx image to serve the built files
FROM nginx:alpine

# Remove default Nginx configuration and add a custom one
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
