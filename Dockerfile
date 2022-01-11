FROM node:14 as base
RUN npm i typescript nodemon && npm i
EXPOSE 4000:4000

FROM base as prod
RUN npm start
