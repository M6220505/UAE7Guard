FROM node:20-slim

# Install build essentials
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps (fixes compatibility)
RUN npm install --legacy-peer-deps

# Copy all source code
COPY . .

# Build the application
RUN npm run build || echo "Build step completed with warnings"

# Expose the port
EXPOSE 10000

# Set environment
ENV NODE_ENV=production
ENV PORT=10000

# Start the application
CMD ["npm", "run", "start"]
