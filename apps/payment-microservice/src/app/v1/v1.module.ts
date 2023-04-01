import { Module } from '@nestjs/common';
import { PaymentModule } from './modules/payment/payment.module';
import { V1Controller } from './v1.controller';

@Module({
  imports: [PaymentModule],
  controllers: [V1Controller],
})
export class V1Module {}
