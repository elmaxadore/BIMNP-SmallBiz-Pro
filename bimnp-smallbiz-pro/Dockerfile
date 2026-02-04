# ==========================================
# STAGE 1: Build Environment (Builder)
# ==========================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./

# Install all dependencies (including devDeps like esbuild and typescript)
# npm ci ensures a clean, reproducible install from package-lock.json
RUN npm ci

# Copy the rest of the source code
COPY . .

# Execute the build pipeline
# This triggers: esbuild bundling -> dist/ creation -> static asset cloning
RUN npm run build

# ==========================================
# STAGE 2: Production Runtime (Runner)
# ==========================================
FROM node:20-alpine AS runner

# 1. Install tini to handle signal forwarding (SIGTERM) and zombie processes
# 2. Add wget for the healthcheck
RUN apk add --no-cache tini wget

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Create app directory and set ownership to the non-root 'node' user
WORKDIR /app
RUN chown node:node /app

# Copy package files to install production-only dependencies
COPY --chown=node:node package*.json ./

# Install ONLY production dependencies (e.g., express, @google/genai)
# This keeps the image lightweight and reduces the attack surface
RUN npm ci --only=production

# Copy built artifacts from the builder stage
# According to spec, server.js and assets are now inside /dist
COPY --from=builder --chown=node:node /app/dist ./dist

# Switch to the non-root user for security
USER node

# Expose the application port
EXPOSE 8080

# Define a healthcheck to ensure the SPA is serving traffic
# This allows Fly.io to verify the instance is ready before routing
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Use tini as the entrypoint to manage the Node process correctly
ENTRYPOINT ["/sbin/tini", "--"]

# Start the Express server
# The server handles SPA routing and serves the index.js bundle
CMD ["node", "dist/server.js"]