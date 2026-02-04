# ==========================================
# STAGE 1: Build Environment (Builder)
# ==========================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy EVERYTHING first to ensure the builder sees your context
# This bypasses the specific "package.json not found" error by grabbing the whole folder
COPY . .

# Install all dependencies (Required for esbuild and typescript)
RUN npm install

# Execute the build pipeline as per package.json
# This creates the /app/dist directory containing bundled assets
RUN npm run build

# ==========================================
# STAGE 2: Production Runtime (Runner)
# ==========================================
FROM node:20-alpine AS runner

# Install tini for signal handling and wget for healthchecks
RUN apk add --no-cache tini wget

# Set Production Environment
ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

# Secure the app directory for the non-root 'node' user
RUN chown node:node /app

# Copy only production essentials from the builder
COPY --from=builder --chown=node:node /app/package*.json ./
RUN npm install --omit=dev

# Copy the final artifacts into the dist folder as per spec
COPY --from=builder --chown=node:node /app/dist ./dist

# Security: Run as non-root user
USER node

# Networking
EXPOSE 8080

# Healthcheck: Ensures the SPA/Express server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Entrypoint manages process signals correctly
ENTRYPOINT ["/sbin/tini", "--"]

# Start the BIMNP Enterprise Intelligence OS
CMD ["node", "dist/server.js"]