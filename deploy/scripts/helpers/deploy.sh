#!/usr/bin/env bash

# Activate error capture
set -e
trap '' EXIT

declare -a allHostsPool
declare -a availableHostsPool
declare -a ansibleHostsPaths

allHostsPoolFilePath=/tmp/.icl_all_hosts
availableHostsPoolFilePath=/tmp/.icl_deploy_available_hosts
ansibleHostsPathsFilePath=/tmp/.icl_deploy_ansible_hosts_paths

function saveVars {
  printf "%s\n" "${allHostsPool[@]}" > $allHostsPoolFilePath
  printf "%s\n" "${availableHostsPool[@]}" > $availableHostsPoolFilePath
  printf "%s\n" "${ansibleHostsPaths[@]}" > $ansibleHostsPathsFilePath
}

function restoreVars {
  if test -f "$allHostsPoolFilePath"; then
    allHostsPool=( $(cat "$allHostsPoolFilePath") )
  fi
  if test -f "$availableHostsPoolFilePath"; then
    availableHostsPool=( $(cat "$availableHostsPoolFilePath") )
  fi
  if test -f "$ansibleHostsPathsFilePath"; then
    ansibleHostsPaths=( $(cat "$ansibleHostsPathsFilePath") )
  fi
}

function resetVars {
  rm -f $allHostsPoolFilePath
  rm -f $availableHostsPoolFilePath
  rm -f $ansibleHostsPathsFilePath
}

function getHost {
  host="$1"
  if [[ ! $host ]]
  then
      host="production/*"
  fi

  # check if host type is correct
  if [[ $host == *"*"* ]] && [[ ! -d ./hosts/$(dirname "$host") ]]
  then
      echo "* Error! Wrong server type name $host" >&2
      exit 100
  fi

  # check if host name is correct
  if [[ $host != *"*"* ]] && [[ ! -f ./hosts/$host.yml ]]
  then
      echo "* Error! Wrong server host name $host" >&2
      exit 101
  fi

  echo "$host"
}

function getComposeFileByHost {
  composeFile="docker-compose-prod.yml"

  echo "$composeFile"
}

function buildAllHostsPool {
  host=$(getHost "$1")

  if [[ $host == *"*"* ]]
  then
      for entry in ./hosts/$host
      do
        hostName=$(basename "$entry" .yml)
        allHostsPool+=( "$hostName" )
        ansibleHostsPaths+=( "-i $entry" )
      done
  else
      hostName=$(echo "$host" | sed -r "s/^[^\/]+\///g")
      allHostsPool+=( "$hostName" )
      ansibleHostsPaths+=( "-i ./hosts/$host.yml" )
  fi

  saveVars
}

function getAnsibleArgs {
  restoreVars

  host=$(getHost "$1")
  # Run build hosts pool if ansibleHostsPaths is empty
  if [ ${#ansibleHostsPaths[@]} -eq 0 ]; then
    buildAllHostsPool "$host"
  fi

  printf "%s "  "${ansibleHostsPaths[@]}"
}

function confirmAnsibleSetup {
  host=$(getHost "$1")

  read -rp $'\n'"Run server setup for host $host (y/n)? " answer
  if [[ "$answer" != "y" ]]
  then
      exit 103
  fi
}

function setupHostsSshByPublicKey {
  host=$(getHost "$1")
  buildAllHostsPool "$host"

  read -rp "Enter ssh private key path [~/.ssh/icl_prod]: " privateKeyPath
  privateKeyPath=${privateKeyPath:-~/.ssh/icl_prod}

  read -rp "Enter ssh public key path [~/.ssh/icl_prod.pub]: " publicKeyPath
  publicKeyPath=${publicKeyPath:-~/.ssh/icl_prod.pub}

  # Deactivates error capture
  set +e

  for singleHost in "${allHostsPool[@]}"
  do
    ssh -i $privateKeyPath -o PreferredAuthentications=publickey -o ConnectTimeout=5 "root@$singleHost" 'exit 0' &>/dev/null
    status=$?

    statusMsg="Check ssh with [$singleHost]"
    okMsg="\033[0;32mOK\033[0m"
    failMsg="\033[0;31mFail\033[0m"

    if [ $status -eq 0 ]
    then
      echo -e "${statusMsg} - [publicKey] - ${okMsg}"
    else
      echo -e "${statusMsg} - [publicKey] - ${failMsg}"
      echo -e "Trying to connect with password..\n"

      ssh-copy-id -i $publicKeyPath -o PreferredAuthentications=password -o ConnectTimeout=5 root@${singleHost} 1> /dev/null
      status=$?

      msg="Check ssh with [password] $singleHost"
      if [ $status -eq 0 ]
      then
        echo -e "${statusMsg} - [password] - ${okMsg}"
      else
        echo -e "${statusMsg} - [password] - ${failMsg}"
      fi
    fi
  done

  # Re-activates error capture
  set -e
}

function checkHostsPoolAvailability {
  host=$(getHost "$1")
  buildAllHostsPool "$host"

  # Deactivates error capture
  set +e

  local -a unavailableHostsPool
  for singleHost in "${allHostsPool[@]}"
  do
    ssh -o ConnectTimeout=5 "$singleHost" 'exit 0' &>/dev/null
    status=$?
    if [ $status -ne 0 ]
    then
      unavailableHostsPool+=("$singleHost")
    else
      availableHostsPool+=("$singleHost")
    fi
    msg=$([ "$status" == 0 ] && echo "\033[0;32mOK\033[0m" || echo "\033[0;31mFail\033[0m")
    echo -e "Check host $singleHost - $msg"
  done

  # Remove unavailable hosts from ansible params
  for i in "${unavailableHostsPool[@]}"; do
    removePattern="-i *$i*"
    ansibleHostsPaths=( "${ansibleHostsPaths[@]/$removePattern}" )
  done

  saveVars

  if [ ${#unavailableHostsPool[@]} -ne 0 ]; then
    echo ""
    echo -e "\033[0;31mUnavailable hosts:\033[0m"
    echo "${unavailableHostsPool[@]}"
    echo ""

    echo -n "Would you like to continue (y/n)?"
    read -r answer
    if [ "$answer" == "${answer#[Yy]}" ]
    then
        echo "* Error! Unavailable hosts found" >&2
        exit 6
    fi
  fi

  # Re-activates error capture
  set -e
}

function deployHostsPool
{
  restoreVars

  host="$1"
  imageTag="$2"
  composeFile=$(getComposeFileByHost "$host")

  # Run build hosts pool if ansibleHostsPaths is empty
  if [ ${#availableHostsPool[@]} -eq 0 ]; then
    targetPool=("${allHostsPool[@]}")
  else
    targetPool=("${availableHostsPool[@]}")
  fi

  for hostName in "${targetPool[@]}"
  do
    printf "\n\n* Deploying to %s...\n\n" "$hostName"
    if ! make -- --deploy-single HOST="$hostName" IMAGE_TAG="$imageTag" COMPOSE_FILE="$composeFile"
      then
      echo "* Error! Deployment error for $hostName" >&2
      exit 7
    fi
  done
}

# run any helper function from makefile HACK
if declare -f "$1" > /dev/null
then
  # call arguments verbatim
  cd "$(dirname "$0")/../../" || exit
  "$@"
else
  # Show a helpful error
  echo "'$1' is not a known function name" >&2
  exit 1
fi
