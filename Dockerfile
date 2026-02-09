FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Try to build, but don't fail if it errors
RUN npm run build || true

# Expose port
EXPOSE 10000

ENV NODE_ENV=production
ENV PORT=10000

# Start with dev mode if build failed
CMD if [ -f "dist/index.cjs" ]; then \
      npm run start; \
    else \
      npm run dev; \
    fi
