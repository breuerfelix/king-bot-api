#!/bin/bash
# Ask the user for container name and port

echo hello, what should the container be called?
read container

echo what port you want to run $container on?
read port

echo at which folder do you want to mount the datastorage? for credentials and database.
read cred

sudo docker container run -d -p $port:3000 -v $cred:/usr/kingbot/assets --name $container --restart=always scriptworld/king-bot-api

