FROM nginx:1.17-alpine
MAINTAINER alexgavrilov939@gmail.com

COPY ./docker/nginx/snippets /etc/nginx/snippets/
COPY ./docker/nginx/conf.d/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/nginx/conf.d/.htpasswd /etc/nginx/.htpasswd

WORKDIR /app

ENV TZ=Europe/Moscow
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# Add nginx user to www-data group

RUN apk add shadow
RUN adduser nginx www-data

CMD ["nginx", "-g", "daemon off;"]
