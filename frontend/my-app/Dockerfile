# Step 1: Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (use --legacy-peer-deps if needed to handle peer dependency issues)
RUN npm install --frozen-lockfile --legacy-peer-deps

# Copy the rest of the app code
COPY . .

# Build the Next.js app (production build)
RUN npm run build

# Step 2: Production stage (smaller image)
FROM node:18-slim

WORKDIR /app

# Copy only the built files from the builder stage
COPY --from=builder /app /app

# Install production dependencies only
RUN npm install --production --frozen-lockfile --legacy-peer-deps

# Expose the port the app will run on
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "start"]
