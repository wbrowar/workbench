#!/bin/bash

# cd to the right directory and setup environment
cd /var/www/html \
    && sudo apt-get update -y \
    && sudo apt-get install dialog apt-utils libpng-dev build-essential gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget jpegoptim optipng gifsicle webp libtool automake autoconf nasm -y \
    && sudo apt-get clean \
    && sudo apt-get autoremove -y \
    && sudo npm install -g n \
    && sudo n 11 \
    && PATH="$PATH"

# Search for .env to see whether we've already finished local setup
ENV_FILE=".env"
ENV_EXAMPLE="EXAMPLE.env"
VENDOR="vendor/"

# Check platform
if [ "$(uname)" == "Darwin" ]; then
    PLATFORM="UNIX"
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    PLATFORM="UNIX"
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    PLATFORM="NT"
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    PLATFORM="NT"
fi

if [ -d "$VENDOR" ]
then
    echo "Composer packages already installed"
else
    echo "Installing composer packages"
    if [ "$PLATFORM" == "NT" ]
    then
        php composer install --no-interaction --optimize-autoloader
    else
        composer install --no-interaction --optimize-autoloader
    fi
fi

if [ -f "$ENV_FILE" ]
then
    echo "Environment file found."
else
    echo "Environment file not found. Copying from EXAMPLE.env."
    if [ -f "$ENV_FILE_EXAMPlE" ]
    then
        cp EXAMPLE.env .env
    else
        echo "No EXAMPLE.env found"
    fi
fi