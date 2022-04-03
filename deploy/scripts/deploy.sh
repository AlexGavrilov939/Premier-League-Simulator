#!/usr/bin/env bash

cd "$(dirname "$0")/../" || exit

host=$(./scripts/helpers/deploy.sh getHost "$1")
imageTag="$2"

if [[ ! "$imageTag" ]]
then
    echo "* Error! No image tag specified" >&2
    exit 1;
fi

read -rp $'\n'"Run deployment for host $host with tag $imageTag (y/n)? "$'\n' answer

if [[ "$answer" != "y" ]]
then
    exit 5
fi

./scripts/helpers/deploy.sh resetVars
./scripts/helpers/deploy.sh checkHostsPoolAvailability "$host"
./scripts/helpers/deploy.sh deployHostsPool "$host" "$imageTag"
