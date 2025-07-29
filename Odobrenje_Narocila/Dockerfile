FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY server3.js .
RUN npm install

COPY proto ./proto

EXPOSE 50051
#EXPOSE 3002

RUN npm i -g serve
# Copy your backend code
COPY . .

# Run the dev script
CMD ["npm", "run", "dev"]
