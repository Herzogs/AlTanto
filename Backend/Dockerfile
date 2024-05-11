FROM node:20.04-redhat

WORKDIR /Backend
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "start"]