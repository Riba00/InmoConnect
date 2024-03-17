FROM node:18-alpine3.17
WORKDIR /app
COPY . /app
COPY package.json /app
COPY package-lock.json /app
COPY .env /app

EXPOSE 3000

RUN npm install

CMD ["npm", "run", "server"]
