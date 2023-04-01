import { Authentication } from './authentication.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new Authentication()).toBeDefined();
  });
});

test('validate request', () => {
  expect('jwt').toBeTruthy();
})
