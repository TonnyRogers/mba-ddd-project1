import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { CustomerMYSQLRepository } from '../customer-mysql.repository';
import { Customer } from '../../../../../@core/events-domain/domain/entities/customer.entity';
import { CustomerSchema } from '../../db/schemas';

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init<MySqlDriver>({
    entities: [CustomerSchema],
    dbName: 'events',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    forceEntityConstructor: true,
  });
});

afterEach(async () => {
  await orm.close();
});

beforeEach(async () => {
  const isConnected = await orm.isConnected();
  if (!isConnected) {
    await orm.connect();
  }
});

test('should create Customer by repository', async () => {
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const customerRepo = new CustomerMYSQLRepository(em);
  const customer = Customer.create({
    name: 'Big Tony',
    cpf: '33456774079',
  });
  customerRepo.add(customer);
  await em.flush();
  em.clear();
  const customerFound = await customerRepo.findById(customer.id);

  expect(customerFound.id.equals(customer.id)).toBeTruthy();
  expect(customerFound.name).toBe(customer.name);
  expect(customerFound.cpf.value).toBe('33456774079');
});

test('should update Customer name by repository', async () => {
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const customerRepo = new CustomerMYSQLRepository(em);
  const customer = Customer.create({
    name: 'Big Tony',
    cpf: '33456774079',
  });
  customerRepo.add(customer);

  await em.flush();
  em.clear();
  let customerFound = await customerRepo.findById(customer.id);

  expect(customerFound.id.equals(customer.id)).toBeTruthy();
  expect(customerFound.name).toBe(customer.name);

  customer.changeName('Tonyzão');
  customerRepo.add(customer);
  await em.flush();
  em.clear();

  customerFound = await customerRepo.findById(customer.id);

  expect(customerFound.id.equals(customer.id)).toBeTruthy();
  expect(customerFound.name).toBe(customer.name);
});

test('should delete Customer by repository', async () => {
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const customerRepo = new CustomerMYSQLRepository(em);
  const customer = Customer.create({
    name: 'Big Tony',
    cpf: '33456774079',
  });
  customerRepo.add(customer);

  await em.flush();
  em.clear();
  const customerFound = await customerRepo.findById(customer.id);

  expect(customerFound.id.equals(customer.id)).toBeTruthy();
  expect(customerFound.name).toBe(customer.name);

  customerRepo.delete(customer);
  await em.flush();
  em.clear();

  const customerList = await customerRepo.findAll();

  console.log(customerList);

  expect(customerList).toBeTruthy();
});
