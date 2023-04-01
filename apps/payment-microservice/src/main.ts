/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {Partitioners} from 'kafkajs';
import * as config from 'config';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      producer: {
        allowAutoTopicCreation: true,
        createPartitioner: Partitioners.DefaultPartitioner
      },
      client: {
        brokers: [config.get('kafka.uri')],
      },
    }
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = config.get('service.payments.port');
  await app.startAllMicroservicesAsync();
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
