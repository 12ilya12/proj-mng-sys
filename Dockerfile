# Use Node.js base image
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine

# Set working directory
WORKDIR /app
# Install production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --legacy-peer-deps --only=production

# Copy build files
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000
# Start the application
CMD ["node", "dist/src/main"]