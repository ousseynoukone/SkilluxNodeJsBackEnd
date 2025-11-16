FROM node:18-alpine

# Install netcat for database connection checking
RUN apk add --no-cache netcat-openbsd

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied when available
COPY package*.json ./

RUN npm install --production

RUN npm install -g sequelize-cli

# Bundle app source
COPY . .

# Copy entrypoint script 
RUN chmod +x /usr/src/app/docker-entrypoint.sh

# The app listens on 5050 by default
EXPOSE 5050

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]
