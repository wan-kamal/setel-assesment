FROM node:16.17-alpine AS build

WORKDIR /usr/src

COPY ./apps/orders-microservice ./apps/orders-microservice

COPY ./config ./config

COPY ./libs ./libs

COPY ["nx.json", "workspace.json", "tsconfig.base.json", "package.json", "yarn.lock", "./"]

RUN yarn && yarn --production nx build orders-microservice

# -------------------------------------------

FROM node:16.17-alpine AS serve

WORKDIR /usr/src

COPY --from=build /usr/src/node_modules ./node_modules

COPY --from=build /usr/src/dist ./dist

COPY --from=build /usr/src/config ./config

COPY --from=build /usr/src/libs ./libs

CMD node ./dist/apps/orders-microservice/main.js

