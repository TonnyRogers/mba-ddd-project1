import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { CustomerSchema } from '../infra/db/schemas';
import { CustomerMYSQLRepository } from '../infra/repositories/customer-mysql.repository';
import { Customer } from '../domain/entities/customer.entity';
import { CustomerService } from './customer.service';

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

test('should list Customer by service', async () => {
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const customerRepo = new CustomerMYSQLRepository(em);
  const customerService = new CustomerService(customerRepo);
  const customer = Customer.create({
    name: 'Tony Amaral',
    cpf: '70375887091',
  });
  customerRepo.add(customer);

  await em.flush();
  em.clear();

  const customers = await customerService.list();

  expect(customers.length).toBe(1);
});

test('should create Customer by service', async () => {
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const customerRepo = new CustomerMYSQLRepository(em);
  const customerService = new CustomerService(customerRepo);
  customerService.register({
    name: 'Tony Amaral',
    cpf: '70375887091',
  });

  await em.flush();
  em.clear();

  const customers = await customerService.list();

  expect(customers.length).toBe(1);
});
