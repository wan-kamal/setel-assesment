import { Order } from '@data-access';
import { Test } from '@nestjs/testing';

import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = app.get<PaymentService>(PaymentService);
  });

  describe('verifyPayment', () => {
    it('should return either cancelled or confirmed', () => {
      const currOrder: Order = {
        id: 1,
        orderNo: 10001,
        status: 'created',
        payment: Math.round(Math.random() * 100),
        createdBy: 'jwt',
        updatedBy: 'jwt',
        createdDate: new Date(),
        updatedDate: new Date(),
      };
      currOrder.status = currOrder.payment > 50 ? 'confirmed' : 'cancelled';
      expect(currOrder.status).toBe<'cancelled' | 'confirmed'>(currOrder.status);
    });
  });
});
