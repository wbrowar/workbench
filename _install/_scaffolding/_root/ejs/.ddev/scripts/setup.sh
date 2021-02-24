#!/bin/bash

# Check platform
#if [ "$(uname)" == "Darwin" ]; then
#    PLATFORM="UNIX"
#elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
#    PLATFORM="UNIX"
#elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
#    PLATFORM="NT"
#elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
#    PLATFORM="NT"
#fi


# Begin back-end setup.
if [ -d "/var/www/html/back-end/" ]; then
  echo "Changing working directory to /var/www/html/back-end/."
  cd /var/www/html/back-end/ || exit

  if [ -d "./vendor/" ]; then
    echo "Composer packages already installed."
  else
    echo "Installing composer packages."
    composer install --no-interaction --optimize-autoloader
  fi

  if [ -f "./.env" ]; then
    echo "Craft environment file found."
  else
    echo "Craft environment file not found. Copying from example.env."
    if [ -f "example.env" ]; then
      cp example.env .env
    else
      echo "No example.env found."
    fi
  fi
fi


# Begin front-end setup.
if [ -d "/var/www/html/front-end/" ]; then
  echo "Changing working directory to /var/www/html/front-end/."
  cd /var/www/html/front-end/ || exit

  if [ -d "./node_modules/" ]
  then
      echo "Node packages already installed."
  elif [ -f "./package-lock.json" ]
  then
      echo "Installing node packages."
      npm ci
  else
      echo "Installing node packages."
      npm install
  fi

  if [ -f "./.env" ]; then
    echo "Vue environment file found."
  else
    echo "Vue environment file not found. Copying from example.env."
    if [ -f "example.env" ]; then
      cp example.env .env
    else
      echo "No example.env found."
    fi
  fi
fi