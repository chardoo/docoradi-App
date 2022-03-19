FROM node:17-alpine

# Set the working directory within the container
WORKDIR /usr/src/app
# Install dependencies

COPY package.json .
COPY yarn.lock .

RUN yarn

# Bundle app src
COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]

