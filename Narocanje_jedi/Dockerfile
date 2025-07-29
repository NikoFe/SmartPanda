FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY server2.js .
RUN npm install

#COPY proto ./proto


#COPY gateway.js .

RUN npm i -g serve
# Copy your backend code
COPY . .

# Expose backend port
EXPOSE 3002
#EXPOSE 3002

# Run the dev script
CMD ["npm", "run", "dev"]
