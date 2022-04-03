# PHP-FPM
FROM php:8.0-fpm-alpine

WORKDIR /app

COPY ./docker/php-fpm/conf.d/www.conf /usr/local/etc/php-fpm.d/www.conf
COPY ./docker/php-fpm/conf.d/php-fpm.conf /usr/local/etc/php-fpm.conf
COPY ./docker/php-fpm/conf.d/php.ini /usr/local/etc/php/php.ini
RUN rm /usr/local/etc/php-fpm.d/zz-docker.conf

#RUN apk --update add gnupg gosu curl ca-certificates zip unzip git supervisor sqlite3 libcap2-bin libpng-dev python2

RUN apk --update add php-cli
RUN apk --update add php-pgsql php-sqlite3 php-gd

RUN apk --update add \
    php-curl php-imap \
    php-mbstring php-xml php-zip \
    php-bcmath php-soap php-intl \
    php-msgpack php-ldap

RUN set -xe && \
    apk add --update icu freetype-dev libjpeg-turbo-dev libpng-dev && \
    apk add --no-cache --virtual .php-deps make && \
    apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        zlib-dev \
        icu-dev \
        g++ && \
    pecl install redis && \
    docker-php-ext-install mysqli pdo pdo_mysql gd intl opcache pcntl && \
    docker-php-ext-enable mysqli redis pdo pdo_mysql pcntl && \
    docker-php-source delete

# Create zerobot folder
RUN mkdir -p /var/www/html

# Create sockets folder
RUN mkdir -p /var/run/sockets && chmod -R 775 /var/run/sockets && chown -R :www-data /var/run/sockets

# Dig
RUN apk update && apk add bind-tools


RUN apk add --no-cache supervisor socat

# Horizon, PHP-FPM, Schedule
COPY ./docker/php-fpm/supervisor.d/supervisord.conf /etc/
COPY ./docker/php-fpm/supervisor.d/horizon.ini /etc/supervisor.d/
COPY ./docker/php-fpm/supervisor.d/php-fpm.ini /etc/supervisor.d/
COPY ./docker/php-fpm/supervisor.d/schedule.ini /etc/supervisor.d/

CMD ["/usr/bin/supervisord", "-nc", "/etc/supervisord.conf"]
