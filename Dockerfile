# ==========================================
# STAGE 1: Build Environment (Builder)
# ==========================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# 1. Copy package files individually to verify presence
COPY package.json ./
COPY package-lock.json* ./

# 2. Install ALL dependencies
# We use 'npm install' to handle cases where package-lock might be missing
RUN npm install

# 3. Copy the rest of the source code
COPY . .

# 4. Run the build script (Generates /app/dist)
# Per spec: bundles index.tsx -> dist/index.js and copies server.js
RUN npm run build

# ==========================================
# STAGE 2: Production Runtime (Runner)
# ==========================================
FROM node:20-alpine AS runner

# Install tini (signal handling) and wget (healthchecks)
RUN apk add --no-cache tini wget

# Set Production Environment
ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

# Ensure the 'node' user owns the directory
RUN chown node:node /app

# 5. Only copy production-essential files
COPY --from=builder --chown=node:node /app/package*.json ./
RUN npm install --omit=dev

# 6. Copy the bundled artifacts from the builder
COPY --from=builder --chown=node:node /app/dist ./dist

# Security: Switch to non-root user
USER node

# Networking
EXPOSE 8080

# Healthcheck: Points to the /health endpoint specified in the spec
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Signal forwarding via tini
ENTRYPOINT ["/sbin/tini", "--"]

# Start the Enterprise Intelligence OS
CMD ["node", "dist/server.js"]