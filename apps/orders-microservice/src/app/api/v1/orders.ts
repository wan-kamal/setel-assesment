import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { IOrder, OrderStatus } from '@data-access';
// import {
//   entityHandler,
//   permissionHandler,
// } from '../../common/endpoint.handler';
// import { permissionService } from '../../common/endpoint.service';
// import { orderStateHandler } from '../../handlers/order.handler';
import { UUID } from 'bson';
import { combineLatest, forkJoin, from, timer } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import * as Daddy from 'papaparse';
import * as zlib from 'zlib';
import * as config from 'config';
import { refreshOrders$ } from '../../events/orders-events';

const orders: FastifyPluginAsync = async (server: FastifyInstance) => {
  const collection = server.mongo.db.collection(
    config.database.mongo.collections.orders
  );

  server.route({
    method: 'GET',
    url: '',
    errorHandler: (error, request, reply) => {
      server.errorHandler(error, request, reply);
    },
    handler: async (request, reply) => {
      const csv: string = Daddy.unparse(
        await collection
          .find(request.query)
          .map((doc) => {
            Reflect.deleteProperty(doc, '_id');
            return doc;
          })
          .toArray()
      );
      // TODO: convert to stream
      return reply.code(200).type('text/csv').compress(csv);
    },
    wsHandler: (connection, request) => {
      combineLatest([timer(0, 1000), refreshOrders$])
        .pipe(
          exhaustMap(() =>
            forkJoin([
              from(collection.find(request.query).toArray()),
              from(collection.countDocuments(request.query)),
            ]).pipe(
              map(([a, b]) => ({
                data: a,
                total: b,
              }))
            )
          )
        )
        .subscribe((res) => connection.socket.send(JSON.stringify(res)));
    },
  });

  server.get<{ Params: { id: string } }>(
    '/:id',
    {
      errorHandler: (error, request, reply) => {
        server.errorHandler(error, request, reply);
      },
      compress: {
        brotliOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
          },
        },
      },
    },
    async (request, reply) => {
      const order = await collection.findOne({ orderId: request.params.id });
      server.redis.set('lastQueryOrder', Buffer.from(JSON.stringify(order)));
      return reply
        .code(200)
        .compress(await server.redis.getBuffer('lastQueryOrder'));
    }
  );

  server.post<{ Body: IOrder }>(
    '',
    {
      errorHandler: (error, request, reply) => {
        server.errorHandler(error, request, reply);
      },
      compress: {
        brotliOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
          },
        },
      },
    },
    async (request, reply) => {
      const newOrder = <IOrder>{
        orderId: new UUID().toString(),
        status: OrderStatus.CREATED,
        createdDate: new Date(),
        updatedDate: new Date(),
      };
      await collection.insertOne(newOrder);
      const buffer = Buffer.from(JSON.stringify(newOrder));
      server.kafka.producer.send({
        topic: config.kafka.topics.ordersCreated,
        messages: [{ key: newOrder.orderId, value: buffer }],
      });
      server.redis.set('lastPostedOrder', buffer);
      refreshOrders$.next(true);
      return reply.code(200).compress(buffer);
    }
  );
};

export default orders;
