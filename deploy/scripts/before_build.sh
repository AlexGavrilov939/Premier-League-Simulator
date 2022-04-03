#!/usr/bin/env bash

source ./scripts/helpers/common.sh

cd "$(dirname "$0")/../" || exit

imageTag="$1"

iclRepo="git@github.com:AlexGavrilov939/Premier-League-Simulator.git"

isTest=$([[ "$imageTag" =~ ^test ]] && echo true || echo false)
buildEnv=$($isTest && echo "staging" || echo "prod")
buildFolder="build/$buildEnv";

if $isTest
then
  rm -rf "$buildFolder"
  mkdir -p "$buildFolder" && cd "$buildFolder" || exit
  rsync -a --exclude={deploy,node_modules,.git} ../../../../icl .
else
  mkdir -p "$buildFolder" && cd "$buildFolder" || exit
  gitClonePull $iclRepo 'deploy' 'icl'
fi

rm -f ../target
ln -fs "$buildEnv" ../target
echo $(pwd)
cp ../../.env ./icl/.env
