import { Order } from '@data-access';
import { Test, TestingModule } from '@nestjs/testing';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

describe('PaymentController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [PaymentService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to payment-microservice!"', () => {
      const paymentController = app.get<PaymentController>(PaymentController);
      const newOrder: Order = {
        id: 1,
        orderNo: 10001,
        status: 'created',
        payment: Math.round(Math.random() * 100),
        createdBy: 'jwt',
        updatedBy: 'jwt',
        createdDate: new Date(),
        updatedDate: new Date(),
      };
      const jwt = 'jwt';
      newOrder.status = newOrder.payment > 50 ? 'confirmed' : 'cancelled';
      paymentController.submitPayment(jwt, newOrder).then((resolved: any) =>
        expect(resolved.data.orderStatus).toBe<'cancelled' | 'confirmed'>(resolved.data.orderStatus)
      )
    });
  });
});
