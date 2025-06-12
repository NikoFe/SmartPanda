FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

RUN npm i -g serve
# Copy your backend code
COPY . .

# Expose backend port
EXPOSE 3000

# Run the dev script
CMD ["npm", "run", "dev"]
