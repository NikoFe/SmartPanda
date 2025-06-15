FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY vite.config.js ./
RUN npm install

# Copy source files
COPY . .

# Build the frontend
RUN npm run build

# Optional: Use a lightweight server like `serve`
RUN npm install 

EXPOSE 5173

# Serve build folder
CMD ["npm", "run", "dev"]
