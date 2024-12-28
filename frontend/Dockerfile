FROM node:23-alpine

WORKDIR /app
ENV PATH="/app/node_modules/.bin:$PATH"
COPY ./package*.json ./
RUN npm install

COPY ./ ./