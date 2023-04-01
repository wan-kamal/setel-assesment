import { Inject, Injectable } from '@nestjs/common';
import { IOrder, OrderStatus } from '@data-access';
import { ClientProxy } from '@nestjs/microservices';
import * as config from 'config';

@Injectable()
export class PaymentService {
  constructor(@Inject('orders') private kafkaClient: ClientProxy) {}

  private serverLag = 1000;

  async processPayment(order: IOrder) {
    order.payment = Math.round(Math.random() * 100);
    await this.verifyAuth();
    await this.verifyTacCode();
    return await this.verifyPayment(order);
  }

  private async verifyAuth() {
    await setTimeout(() => console.log('Verifying payment details...'), this.serverLag * 1);
    await setTimeout(() => console.log('Verifying account...'), this.serverLag * 2);
  }

  private async verifyTacCode() {
    await setTimeout(() => console.log('Waiting for Tac Code...'), this.serverLag * 3);
    await setTimeout(() => console.log(`Received Tac Code ${Math.floor(1e5 + Math.random() * 9e5)}`), this.serverLag * 4);
    await setTimeout(() => console.log('Verifying Tac Code...'), this.serverLag * 5);
  }

  private async verifyPayment(order: IOrder) {
    await setTimeout(() => console.log('Veriying payment...'), this.serverLag * 6);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (order.payment < 50) {
          console.log('Insufficient Balance...');
          order.status = OrderStatus.CANCELLED;
        } else {
          console.log('Payment Successful!');
          this.issueReceipt(order.payment);
          order.status = OrderStatus.CONFIRMED;
        }
        return resolve(this.updateOrder(order));
    }, this.serverLag * 7)})
  }

  private issueReceipt(payment: number) {
    console.log(`receipt issued: ${payment}`);
  }

  private updateOrder(order: IOrder) {
    console.log('Updating Order Status...');
    this.kafkaClient.emit(config.get('kafka.topics.ordersUpdated'), Buffer.from(JSON.stringify({key: order.orderId, value: order})));
  }
}
