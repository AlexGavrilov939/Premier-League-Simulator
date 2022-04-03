#!/usr/bin/env bash

cd "$(dirname "$0")/../" || exit

filter="$1"

# check if we have some commits to pull

git fetch &> /dev/null
if git remote show origin | grep -iq "$(git rev-parse --abbrev-ref HEAD)" | grep -iq "(local out of date)"
then
    echo "* Error! You container repo is outdated. You have some git commits to pull before" >&2
    exit 1
fi

# show tags

if [[ $filter ]]
then
    filter="^$filter-"
else
    filter=".*"
fi
grep "$filter" image_tags.list | sort -t - -k 2 -g
