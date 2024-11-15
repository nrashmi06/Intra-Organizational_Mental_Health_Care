# Step 1: Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

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
RUN npm install --production --frozen-lockfile

# Expose the port the app will run on
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "start"]
