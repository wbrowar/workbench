#!/bin/bash

# CD to the right directory
echo "Changing working directory to /var/www/html/back-end/."
cd /var/www/html/back-end/

if [ -d "./vendor/" ]
then
    echo "Checking for .env file."
    if [ -f "./.env" ]
    then
        echo "Running Craft tasks."
        php ./craft migrate/all
        php ./craft project-config/apply
        php ./craft cache/flush-all
    else
        echo "No .env file, not running Craft tasks."
    fi
else
    echo "Composer packages not installed, cannot run Craft tasks."
fi