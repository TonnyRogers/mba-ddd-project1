import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { PartnerMYSQLRepository } from '../partner-mysql.repository';
import { Partner } from '../../../../../@core/events-domain/domain/entities/partner.entity';
import { PartnerSchema } from '../../db/schemas';

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init<MySqlDriver>({
    entities: [PartnerSchema],
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

test('should create partner by repository', async () => {
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const partnerRepo = new PartnerMYSQLRepository(em);
  const partner = Partner.create({ name: 'Big Tony' });
  partnerRepo.add(partner);
  await em.flush();
  em.clear();
  const partnerFound = await partnerRepo.findById(partner.id);

  expect(partnerFound.id.equals(partner.id)).toBeTruthy();
  expect(partnerFound.name).toBe(partner.name);
});

test('should update partner name by repository', async () => {
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const partnerRepo = new PartnerMYSQLRepository(em);
  const partner = Partner.create({ name: 'Big Tony' });
  partnerRepo.add(partner);

  await em.flush();
  em.clear();
  let partnerFound = await partnerRepo.findById(partner.id);

  expect(partnerFound.id.equals(partner.id)).toBeTruthy();
  expect(partnerFound.name).toBe(partner.name);

  partner.changeName('Tonyzão');
  partnerRepo.add(partner);
  await em.flush();
  em.clear();

  partnerFound = await partnerRepo.findById(partner.id);

  expect(partnerFound.id.equals(partner.id)).toBeTruthy();
  expect(partnerFound.name).toBe(partner.name);
});

test('should delete partner by repository', async () => {
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const partnerRepo = new PartnerMYSQLRepository(em);
  const partner = Partner.create({ name: 'Big Tony' });
  partnerRepo.add(partner);

  await em.flush();
  em.clear();
  const partnerFound = await partnerRepo.findById(partner.id);

  expect(partnerFound.id.equals(partner.id)).toBeTruthy();
  expect(partnerFound.name).toBe(partner.name);

  partnerRepo.delete(partner);
  await em.flush();
  em.clear();

  const partnerList = await partnerRepo.findAll();

  console.log(partnerList);

  expect(partnerList).toBeTruthy();
});
