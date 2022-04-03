#!/usr/bin/env bash

message="\$1"
if [[ "\$message" ]]
then
    exim -Mvb "\$message"
else
    mailq
fi