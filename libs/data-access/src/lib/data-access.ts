import {ObjectId} from '@fastify/mongodb';

export enum OrderStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface IOrder extends Base {
  orderId: string;
  status: OrderStatus;
  payment: number;
  createdBy: string;
  updatedBy: string;
}

export interface Base {
  _id: ObjectId;
  createdDate: Date;
  updatedDate: Date;
}

export interface IApiResponse<T> {
  data: T;
  total: number;
}
