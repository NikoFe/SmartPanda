FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

COPY proto ./proto

COPY server2.js .
COPY gateway.js .

EXPOSE 3001
EXPOSE 3002

RUN npm i -g serve
# Copy your backend code
COPY . .

# Expose backend port
EXPOSE 3001

# Run the dev script
CMD ["npm", "run", "dev"]
