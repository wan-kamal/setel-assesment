import fastify from 'fastify';
import orders from './app/api/v1/orders';
import cors from '@fastify/cors';
import mongodb from '@fastify/mongodb';
import websocket from '@fastify/websocket';
import compress from '@fastify/compress';
import redis from '@fastify/redis';
import swagger from '@fastify/swagger';
import kafka from 'fastify-kafkajs';
import { Partitioners } from 'kafkajs';
import fastifyGracefulShutdown from 'fastify-graceful-shutdown';
import * as config from 'config';
import ordersUpdatedHandler from './app/handlers/orders-updated.handler';

const server = fastify({ logger: true, pluginTimeout: 30000 });

server
  .register(cors)
  .register(websocket)
  .register(compress)
  .register(kafka, {
    clientConfig: {
      brokers: [config.get('kafka.uri')],
    },
    producerConfig: {
      allowAutoTopicCreation: true,
      createPartitioner: Partitioners.DefaultPartitioner,
    },
  })
  .register(swagger, {
    routePrefix: '/docs/api/v1',
  })
  .register(redis, {
    host: config.get('redis.uri'),
  })
  .register(mongodb, {
    url: config.get('database.mongo.uri'),
    database: config.get('service.operations.database'),
  })
  .register(orders, { prefix: 'api/v1/orders' })
  .register(ordersUpdatedHandler)
  .register(fastifyGracefulShutdown);

const port = config.get('service.operations.port');

const run = async () => {
  try {
    await server.listen({ port }).then((address) => {
      server.log.info(`Server listening at ${address}`);
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

run();
