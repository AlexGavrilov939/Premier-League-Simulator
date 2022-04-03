#!/usr/bin/env bash

cd "$(dirname "$0")/../" || exit

imageTag="$1"
tagsFile="image_tags.list"
currentGitBranch=$(git name-rev --name-only HEAD)

# save container update log

if ! grep -iq "$imageTag" "$tagsFile" && [[ $imageTag != test* ]]
then
    echo "$imageTag" >> "$tagsFile"
    git add "$tagsFile"
    git commit -m "tags file auto update for tag $imageTag"
    git push origin "$currentGitBranch"
fi
