FROM node:14.15

COPY build-and-deploy.sh /build-and-deploy.sh

ENTRYPOINT ["/build-and-deploy.sh"]
