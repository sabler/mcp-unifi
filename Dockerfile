FROM node:22-alpine

# Label for image tagging
LABEL name="mcp-unifi" version="latest"

# Set hostname
RUN echo "mcp-unifi.local" > /etc/hostname

# Install pnpm
RUN corepack enable

WORKDIR /app

# Copy package files first for better caching
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code and build script
COPY src/ ./src/
COPY build.js tsconfig.json ./

# Build TypeScript
RUN pnpm build

# Clean up dev dependencies after build
RUN pnpm install --frozen-lockfile --prod

# Create non-root user for security
RUN addgroup -g 1001 -S mcp && \
    adduser -S mcp -u 1001

USER mcp

CMD ["node", "dist/index.js"]