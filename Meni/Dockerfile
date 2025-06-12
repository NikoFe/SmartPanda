# ---------- FRONTEND ----------
FROM node:18-alpine AS frontend-build
WORKDIR /Meni/frontend

# Install dependencies
COPY frontend/package*.json ./ 
COPY frontend/vite.config.js ./
RUN npm install

# Copy and build frontend
COPY frontend/ . 
RUN npm run build


# ---------- BACKEND ----------
FROM node:18-alpine AS backend
WORKDIR /Meni/backend

# Install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend source code
COPY backend/ . 

# Optionally copy frontend build into backend to serve via Express
COPY --from=frontend-build /Meni/frontend/dist ./public

EXPOSE 3000

# Start the backend server
CMD ["npm", "run", "dev"]
