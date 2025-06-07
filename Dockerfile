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

# Build the application (Railway build command)
RUN node esbuild.config.js

# Expose port
EXPOSE 5000

# Start the application (Railway start command)
CMD ["node", "dist/railway-entry.js"]
