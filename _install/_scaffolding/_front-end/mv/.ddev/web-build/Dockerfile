ARG BASE_IMAGE
FROM $BASE_IMAGE

# Run setup steps
RUN npm install -g n && n 17
RUN apt-get update && apt-get install -y -o Dpkg::Options::="--force-confold" --no-install-recommends --no-install-suggests nodejs apt-utils
RUN apt-get clean && apt-get autoremove -y