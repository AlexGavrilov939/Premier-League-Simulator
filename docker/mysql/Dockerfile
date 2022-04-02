FROM mysql:5.7.34

MAINTAINER alexgavrilov939@gmail.com

# Config

COPY ./mysql.conf.d/mysqld.cnf /etc/mysql/mysql.conf.d/mysqld.cnf

# Create logs folder

RUN mkdir -p /var/log/icl && \
    chmod -R 775 /var/log/icl && \
    chown mysql /var/log/icl

# Shell aliases

ENV ENV="/root/.ashrc"
RUN echo "alias ll='ls -al'" > "$ENV"

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 467B942D3A79BD29 && \
    apt-get update && \
    apt-get -qq -y install supervisor

CMD ["mysqld"]
