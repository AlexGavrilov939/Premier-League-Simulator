#!/usr/bin/env bash

cd "$(dirname "$0")/../" || exit

imageTag="$1"
operation="$2"
tagsFile="image_tags.list"
currentGitBranch=$(git rev-parse --abbrev-ref HEAD)

# test for allowed tags

if ! [[ $imageTag =~ ^test- ]] && ! [[ $imageTag =~ ^icl-[0-9]+ ]]
then
    echo "* Error! Invalid tag name" >&2
    exit 1
fi

# we compare tag and command to avoid mismatch

tagType=$(echo "$imageTag" | grep -Eioq "^[a-z]+")
if [[ $tagType != "test" ]] && ! echo "$operation" | grep -iq "$tagType"
then
    echo "* Error! Operation doesn't match tag type" >&2
    exit 2
fi

# we allow to push to production only from deploy git branch and

if [[ $currentGitBranch != "deploy" ]] && ! [[ $imageTag =~ ^test ]]
then
    echo "* Error! You are allowed to push to production only from git deploy branch" >&2
    exit 3
fi

# check if we have some commits to pull

git fetch &> /dev/null
if git remote show origin | grep -iq "$currentGitBranch" | grep -iq "(local out of date)"
then
    echo "* Error! You container repo is outdated. You have some git commits to pull before" >&2
    exit 4
fi

# check for duplicate tags
# we don't allow to push new tags for update-source commands

if ! grep -iq "$imageTag" "$tagsFile"
then
    if [[ $operation =~ ^update-[a-z]+-source$ ]]
    then
        echo "* Error! It is not allowed to add new tags for $operation operation" >&2
        exit 5
    fi
else
    if [[ $imageTag != test* ]]
    then
      echo -n "* Image tag [$imageTag] exists. Would you like to overwrite (y/n)?"
      read -r answer
      if [ "$answer" == "${answer#[Yy]}" ]
      then
          echo "* Error! Duplicate tags" >&2
          exit 6
      fi
    fi
fi
