# Stage 1: Build
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Only copy package files first to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production image
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

# Copy only necessary files from the builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]
