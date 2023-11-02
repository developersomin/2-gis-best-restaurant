FROM node:18

COPY ./package.json /api/
COPY ./yarn.lock /api/
COPY ./src/commons/fs/data.csv /api/data.csv
WORKDIR /api/
RUN yarn install

COPY . /api/

CMD yarn start:dev