import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { PartnerSchema } from './schemas';
import { Partner } from '../../domain/entities/partner.entity';

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

test('should create an partner', async () => {
  await orm.schema.refreshDatabase();
  const partner = Partner.create({ name: 'Big Tony' });

  const em = orm.em.fork();
  console.log('partner', partner);

  em.persist(partner);
  await em.flush();
  em.clear(); // clear UW cache

  const partnerFound = await em.findOne(Partner, { id: partner.id });

  console.log(partnerFound);
});
