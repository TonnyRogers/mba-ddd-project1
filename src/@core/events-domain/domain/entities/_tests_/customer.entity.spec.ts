import { Customer } from '../customer.entity';

test('should create an client', () => {
  Customer.create({
    name: 'Tony Amaral',
    cpf: '499.561.820-10',
  });
});
