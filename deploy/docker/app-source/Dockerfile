# COMPOSER
FROM php:8.0-fpm-alpine3.13 as composer
WORKDIR /app

ENV COMPOSER_ALLOW_SUPERUSER 1

COPY --chown=www-data:www-data ./build/target ./

# Install composer
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_VERSION 2.2.6

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer --version=${COMPOSER_VERSION}

# ignore-platform-reqs uses because it builds in a separate container which has no extra php extensions
RUN cd /app/icl && composer install --no-progress --optimize-autoloader --ignore-platform-reqs --no-dev

# NODE
FROM node:lts-alpine3.12 as node
WORKDIR /app

COPY --from=composer /app/icl ./

RUN yarn install --production --frozen-lockfile && yarn run prod

# ALPINE
FROM alpine:3.13

WORKDIR /app
COPY --from=node /app ./

# App Storage
RUN mkdir -p /storage/framework/cache/data && \
    mkdir -p /storage/framework/views && \
    mkdir -p /storage/framework/sessions && \
    mkdir -p /storage/app/public && \
    addgroup www-data && \
    chown :www-data /storage && \
    chmod -R 777 /storage && \
    rm -rf /app/storage && \
    ln -sfn /storage /app/storage && \
    chown -R :www-data /app/storage
