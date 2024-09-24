import { Name } from './name.vo';

test('should create an valid name', () => {
  const nameValue = 'tony amaral';

  const name = new Name(nameValue);
  expect(name.value).toBe(nameValue);
});
