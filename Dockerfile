FROM node:lts-alpine

WORKDIR /usr/kingbot

COPY . .

RUN npm install && npm run build

EXPOSE 3000

CMD ["npm", "start"]
