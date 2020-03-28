FROM node:12.16.1-alpine3.9 as builder

WORKDIR /edge
COPY ./ /edge

RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash git openssh && \
    apk add curl && \
    yarn install

FROM node:12.16.1-alpine3.9
COPY --from=builder /edge /


EXPOSE 3000

COPY entrypoint.sh /usr/bin/entrypoint.sh
ENTRYPOINT [ "entrypoint.sh" ]

CMD ["yarn", "start-gateway"]
