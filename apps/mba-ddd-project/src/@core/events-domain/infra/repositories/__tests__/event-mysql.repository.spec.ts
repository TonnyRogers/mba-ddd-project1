import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { EventMYSQLRepository } from '../event-mysql.repository';
import {
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  PartnerSchema,
} from '../../db/schemas';
import { Partner } from '../../../../../@core/events-domain/domain/entities/partner.entity';
import { PartnerMYSQLRepository } from '../partner-mysql.repository';

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init<MySqlDriver>({
    entities: [EventSchema, EventSectionSchema, EventSpotSchema, PartnerSchema],
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

test.only('should create Event by repository', async () => {
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const eventRepo = new EventMYSQLRepository(em);
  const partnerRepo = new PartnerMYSQLRepository(em);
  const partner = Partner.create({
    name: 'Will JA',
  });

  partnerRepo.add(partner);
  const event = partner.initEvent({
    name: 'Big Event',
    date: new Date(),
    description: '',
  });

  event.addSection({
    name: 'Section 1',
    description: 'some section',
    price: 100,
    total_spots: 2500,
  });

  eventRepo.add(event);
  await em.flush();
  em.clear();
  const eventFound = await eventRepo.findById(event.id);
  console.log(eventFound);
});

// test('should update Event name by repository', async () => {
//   await orm.schema.refreshDatabase();
//   const em = orm.em.fork();

//   const eventRepo = new EventMYSQLRepository(em);
//   const event = Event.create({
//     name: 'Big Tony',
//     cpf: '33456774079',
//   });
//   eventRepo.add(event);

//   await em.flush();
//   em.clear();
//   let eventFound = await eventRepo.findById(event.id);

//   expect(eventFound.id.equals(event.id)).toBeTruthy();
//   expect(eventFound.name).toBe(event.name);

//   event.changeName('Tonyzão');
//   eventRepo.add(event);
//   await em.flush();
//   em.clear();

//   eventFound = await eventRepo.findById(event.id);

//   expect(eventFound.id.equals(event.id)).toBeTruthy();
//   expect(eventFound.name).toBe(event.name);
// });

// test('should delete Event by repository', async () => {
//   await orm.schema.refreshDatabase();
//   const em = orm.em.fork();

//   const eventRepo = new EventMYSQLRepository(em);
//   const event = Event.create({
//     name: 'Big Tony',
//     cpf: '33456774079',
//   });
//   eventRepo.add(event);

//   await em.flush();
//   em.clear();
//   const eventFound = await eventRepo.findById(event.id);

//   expect(eventFound.id.equals(event.id)).toBeTruthy();
//   expect(eventFound.name).toBe(event.name);

//   eventRepo.delete(event);
//   await em.flush();
//   em.clear();

//   const eventList = await eventRepo.findAll();

//   console.log(eventList);

//   expect(eventList).toBeTruthy();
// });
