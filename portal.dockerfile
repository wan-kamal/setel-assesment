FROM node:16.17-alpine AS build

WORKDIR /usr/src

COPY ./apps/orders-operations-portal ./apps/orders-operations-portal

COPY ./config ./config

COPY ./libs ./libs

COPY ["babel.config.json", "nx.json", "workspace.json", "tsconfig.base.json", "package.json", "yarn.lock", "./"]

RUN yarn && yarn --production nx build orders-operations-portal

# -------------------------------------------

FROM node:16.17-alpine AS serve

WORKDIR /usr/src

COPY --from=build /usr/src/node_modules ./node_modules

COPY --from=build /usr/src/dist ./dist

COPY --from=build /usr/src/config ./config

COPY --from=build /usr/src/libs ./libs

CMD npx http-server -p 80 ./dist/apps/orders-operations-portal
