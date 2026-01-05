FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies using npm ci (clean install)
# We use --omit=dev to avoid installing devDependencies in production
# but for this build we need them to build the client
RUN npm install -g tsx && npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
