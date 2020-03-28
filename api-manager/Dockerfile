FROM node:12.16.1-alpine3.9 as builder

WORKDIR /api-manager
COPY ./ /api-manager

RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash git openssh && \
    yarn install

FROM node:12.16.1-alpine3.9
COPY --from=builder /api-manager /


EXPOSE 3001 3002 3003 3004


CMD ["yarn", "start-services"]
