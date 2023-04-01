FROM node:16.17-alpine AS build

WORKDIR /usr/src

COPY ./apps/payment-microservice ./apps/payment-microservice

COPY ./config ./config

COPY ./libs ./libs

COPY ["nx.json", "workspace.json", "tsconfig.base.json", "package.json", "yarn.lock", "./"]

RUN yarn && yarn --production nx build payment-microservice

# -------------------------------------------

FROM node:16.17-alpine AS serve

WORKDIR /usr/src

COPY --from=build /usr/src/node_modules ./node_modules

COPY --from=build /usr/src/dist ./dist

COPY --from=build /usr/src/config ./config

COPY --from=build /usr/src/libs ./libs

CMD node ./dist/apps/payment-microservice/main.js
