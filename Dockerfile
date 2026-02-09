FROM node:20-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "run", "start"]
