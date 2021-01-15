FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN yarn
RUN yarn build

# Bundle app source
COPY . .
COPY .env.prod .env

EXPOSE 5000
CMD [ "yarn", "start:prod" ]
