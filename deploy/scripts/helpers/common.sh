#!/usr/bin/env bash

function gitClonePull {
  repo=$1
  branch="${2:-deploy}"
  folder=${3:-$(basename "${1#*icl.}" .git)}

  if [ -d "$folder" ]; then
    cd "$folder" || exit
    git fetch
    git reset --hard origin/"$branch"
    git pull -q --ff-only origin "$branch"
    cd ../
  else
    git clone -b "$branch" "$repo" "$folder"
  fi
}
