#!/bin/bash
# Ask the user for container name and port

echo Hello, what shall i call the container?
read container

echo What port you want to run $container on?
read port

echo what is the name of the cred file?
read cred

docker container run -d -p $port:3000 -v $PWD/$cred:/usr/kingbot/assets/cred.txt --name $container --restart=always scriptworld/king-bot-api

