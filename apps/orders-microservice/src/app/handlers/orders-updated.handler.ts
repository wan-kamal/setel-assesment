import { IOrder } from '@data-access';
import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { ObjectId } from '@fastify/mongodb';
import { refreshOrders$ } from '../events/orders-events';
import * as config from 'config';

const ordersUpdatedHandler: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  try {
    const consumer = server.kafka.client.consumer({
      groupId: config.service.operations.consumerGroup,
    });
    const collection = server.mongo.db.collection(
      config.database.mongo.collections.orders
    );
    await consumer.connect();
    await consumer.subscribe({
      topic: config.kafka.topics.ordersUpdated,
      fromBeginning: false,
    });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const order: IOrder = JSON.parse(message.value.toString()).value;
        server.log.info(`Updating order ${order.orderId}`);
        await collection.updateOne(
          { _id: new ObjectId(order._id) },
          {
            $set: {
              status: order.status,
              payment: order.payment,
              updatedDate: order.updatedDate,
            },
          }
        );
        refreshOrders$.next(true);
      },
    });
  } catch (error) {
    server.log.error(error);
  }
};

export default ordersUpdatedHandler;
