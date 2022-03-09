FROM node:latest

WORKDIR /home/node/app
COPY . .
RUN apt-get update && apt-get install -y wget

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN chmod -R 777 /root
RUN chown -R 1000:1000 "/root/.npm"
RUN chown -R 1000:1000 "/home/node/app"
RUN npm install -g @nestjs/cli
EXPOSE 3000