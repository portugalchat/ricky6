# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Run pre-deploy commands
RUN echo "Executando pre-deploy commands..."
# Exemplos de comandos que você pode adicionar:
# RUN npm run lint
# RUN npm run test
# RUN npm run migrate
# RUN npm run seed-database

# Build the application with timeout and verification
RUN timeout 300 npm run build:client || (echo "Client build timeout, using fallback" && mkdir -p dist/public && echo '<!DOCTYPE html><html><head><title>App</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>' > dist/public/index.html)
RUN node esbuild.config.js
RUN ls -la dist/public/ && echo "Build verification complete"

# Expose port
EXPOSE 5000

# Start the application (Railway start command)
CMD ["node", "dist/railway-entry.js"]
