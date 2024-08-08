import Cpf from 'src/@core/common/domain/value-objects/cpf.vo';
import { Customer, CustomerId } from '../customer.entity';

test('should create an client', () => {
  const customer = Customer.create({
    name: 'Tony Amaral',
    cpf: '49956182010',
  });

  expect(customer).toBeInstanceOf(Customer);
  expect(customer.id).toBeDefined();
  expect(customer.id).toBeInstanceOf(CustomerId);
  expect(customer.name).toBe('Tony Amaral');
  expect(customer.cpf.value).toBe('49956182010');

  const customer2 = new Customer({
    id: new CustomerId(customer.id.value),
    name: 'Bruno Genio',
    cpf: new Cpf('55981763000'),
  });

  expect(customer.equals(customer2)).toBe(true);

  // const customer = Customer.create({
  //   id: new CustomerId() || new CustomerId('12213')
  //   name: 'Tony Amaral',
  //   cpf: '49956182010',
  // });
});
