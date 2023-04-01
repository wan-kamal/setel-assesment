import { Order } from '@data-access';
import { ajax } from 'rxjs/ajax';
import { environment } from '../../environments/environment';

// Integration Test
test('get orders', () => {
  return ajax.get('http://localhost:3000/api/v1/orders', {
    Authorization: environment.visa,
  }).toPromise().then(resolved => {
    expect(resolved.response.data).toBe<Order[]>(resolved.response.data);
  });
});

// Integration Test
test('create a new order', () => {
  return ajax.post(
    'http://localhost:3000/api/v1/orders',
    {},
    { Authorization: environment.visa, 'Content-Type': 'application/json' }
  ).toPromise().then(resolved => {
    expect(resolved.response.data).toBe<Order>(resolved.response.data);
  });
});

// Integration Test
test('cancel an order', () => {
  return ajax.put(
    `http://localhost:3000/api/v1/orders/10001/cancel`,
    {},
    { Authorization: environment.visa, 'Content-Type': 'application/json' }
  ).toPromise().then(resolved => {
    expect(resolved.response.data.status).toBe<string>('cancelled');
  });
});
