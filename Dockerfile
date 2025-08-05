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

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm build

# Create non-root user for security
RUN addgroup -g 1001 -S mcp && \
    adduser -S mcp -u 1001

USER mcp

CMD ["npx", "tsx", "src/index.ts"]