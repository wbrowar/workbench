ARG BASE_IMAGE
FROM $BASE_IMAGE
# Install whatever nodejs version you want
ENV NODE_VERSION=14
RUN sudo apt-get remove -y nodejs
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN curl -sSL --fail https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y -o Dpkg::Options::="--force-confold" --no-install-recommends --no-install-suggests nodejs apt-utils
RUN apt-get clean && apt-get autoremove