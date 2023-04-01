import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { Authentication } from '../../../common/auth/authentication.guard';
import { Authorization } from '../../../common/auth/authorization.guard';
import { PaymentEventHandler } from './payment.controller';
import { PaymentService } from './payment.service';
import * as config from 'config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'orders',
        transport: Transport.KAFKA,
        options: {
          producer: {
            allowAutoTopicCreation: true,
            createPartitioner: Partitioners.DefaultPartitioner
          },
          client: {
            brokers: [config.get('kafka.uri')],
          },
        },
      },
    ]),
  ],
  controllers: [PaymentEventHandler],
  providers: [PaymentService, Authentication, Authorization],
})
export class PaymentModule {}
