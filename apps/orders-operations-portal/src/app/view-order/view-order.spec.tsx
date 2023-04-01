import { Order } from '@data-access';
import { ajax } from 'rxjs/ajax';
import { environment } from '../../environments/environment';

// Integration Test
test('get order by id', () => {
  return ajax.get(`http://localhost:3000/api/v1/orders/10001`, {
    Authorization: environment.visa,
  }).toPromise().then(resolved => {
    expect(resolved.response.data).toBe<Order>(resolved.response.data);
  });
});
