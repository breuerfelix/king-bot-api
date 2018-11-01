FROM node:latest

WORKDIR /usr/kingbot

COPY . .

RUN npm install && npm run build

EXPOSE 3000

CMD ["npm", "run", "gui"]
