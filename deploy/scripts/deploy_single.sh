#!/usr/bin/env bash

cd "$(dirname "$0")/../" || exit

host="$1"
imageTag="$2"
composeFile="$3"

if [[ ! $host ]]
then
    echo "* Error! No host specified" >&2
    exit 1
fi
if [[ ! $imageTag ]]
then
    echo "* Error! No image tag specified" >&2
    exit 2
fi

# a trick to load variables from .env file and
# avoid replacing variables defined in CLI when we call source .env command
# by calculating global vars diff and reverting back overwritten values
env > "/tmp/initial_$composeFile"
set -o allexport && source .env && set +o allexport
env > "/tmp/updated_$composeFile"
comm -23 <(sort "/tmp/initial_$composeFile") <(sort "/tmp/updated_$composeFile") > "/tmp/diff_$composeFile"
# shellcheck disable=SC1090
set -o allexport && source "/tmp/diff_$composeFile" && set +o allexport
envsubst < "$composeFile" > "/tmp/$composeFile"

if ! ssh "$host" /bin/sh << EOF
rm -rf ~/app_$imageTag && \
mkdir ~/app_$imageTag
EOF
then
    echo "* Error! Ssh command failed" >&2
    exit 3
fi
if ! scp "/tmp/$composeFile" "$host:app_$imageTag/$composeFile"
then
    echo "* Error! Ssh copy failed" >&2
    exit 4
fi

if ! ssh "$host" /bin/sh << EOF
echo 'COMPOSE_PROJECT_NAME=icl' >> ~/app_$imageTag/.env && \
echo 'IMAGE_TAG=$imageTag' >> ~/app_$imageTag/.env && \
rm -f ~/app && \
ln -sr ~/app_$imageTag ~/app && \
docker-compose -f ~/app/$composeFile pull && \
docker ps -a -q | xargs -r -I % sh -c 'docker stop %; docker rm %' && \
docker network ls --filter name=icl -q | xargs -r docker network rm && \
docker volume rm --force icl_app icl_sockets && \
docker-compose -f ~/app/$composeFile up -d --build
EOF
then
    echo "* Error! Ssh command failed" >&2
    exit 5
fi
