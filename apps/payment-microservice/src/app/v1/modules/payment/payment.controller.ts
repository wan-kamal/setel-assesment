import { IOrder } from '@data-access';
import { Controller, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Authorization } from '../../../common/auth/authorization.guard';
import { KafkaWrapper } from '../../../common/interfaces/kafka-wrapper';
import { PaymentService } from './payment.service';
import * as config from 'config';

@Controller()
// @UseGuards(Authentication)
export class PaymentEventHandler {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(Authorization)
  @EventPattern(config.get('kafka.topics.ordersCreated'))
  submitPayment(data: KafkaWrapper<IOrder>) {
    this.paymentService.processPayment(data.value);
  }
}
