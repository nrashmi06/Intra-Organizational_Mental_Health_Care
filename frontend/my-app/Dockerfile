# Step 1: Use an official Node.js image as the base image
FROM node:18 AS builder

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --frozen-lockfile

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the Next.js app (build for production)
RUN npm run build

# Step 7: Start from a smaller image (to keep the final image size smaller)
FROM node:18-slim

# Step 8: Set the working directory inside the container
WORKDIR /app

# Step 9: Copy only the necessary files from the builder stage
COPY --from=builder /app ./

# Step 10: Expose the port that the app will run on
EXPOSE 3000

# Step 11: Start the Next.js app in production mode
CMD ["npm", "start"]