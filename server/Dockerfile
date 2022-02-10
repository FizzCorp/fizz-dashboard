FROM node:boron

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN rm -rf /app/node_modules

RUN npm install

RUN npm install -g sequelize-cli

#RUN URL=${PG_HOST}:5432 sh ./scripts/curl_wait.sh

#WORKDIR /app/db

#RUN PG_HOST=${PG_HOST} sequelize db:migrate --config config/config.js --env testing

#RUN PG_HOST=${PG_HOST} sequelize db:seed:all --config config/config.js --env testing

#EXPOSE 8081

#CMD ["npm", "run", "start:testing"]