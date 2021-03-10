FROM node:14.15

COPY test.sh /test.sh

ENTRYPOINT ["/test.sh"]
