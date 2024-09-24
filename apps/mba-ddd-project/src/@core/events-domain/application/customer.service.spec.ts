import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { CustomerSchema } from '../infra/db/schemas';
import { CustomerMYSQLRepository } from '../infra/repositories/customer-mysql.repository';
import { Customer } from '../domain/entities/customer.entity';
import { CustomerService } from './customer.service';
import { UnitOfWorkMikroOrm } from '../../../@core/common/infra/unit-of-work-mikro-orm';

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

test('should create Customer by service', async () => {
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const customerRepo = new CustomerMYSQLRepository(em);
  const unitOfWork = new UnitOfWorkMikroOrm(em);
  const customerService = new CustomerService(customerRepo, unitOfWork);

  const customer = await customerService.register({
    name: 'Tony Amaral',
    cpf: '70375887091',
  });

  em.clear();

  expect(customer).toBeInstanceOf(Customer);
  expect(customer.id).toBeDefined();
  expect(customer.name).toBe('Tony Amaral');
  expect(customer.cpf.value).toBe('70375887091');
});

test('should list Customer by service', async () => {
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const customerRepo = new CustomerMYSQLRepository(em);
  const unitOfWork = new UnitOfWorkMikroOrm(em);
  const customerService = new CustomerService(customerRepo, unitOfWork);

  await customerService.register({
    name: 'Tony Amaral',
    cpf: '70375887091',
  });

  em.clear();

  const customers = await customerService.list();

  expect(customers.length).toBe(1);
  expect(customers.at(0).id).toBeDefined();
});
