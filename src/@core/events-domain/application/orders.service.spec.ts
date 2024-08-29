import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from '../infra/db/schemas';
import { UnitOfWorkMikroOrm } from 'src/@core/common/infra/unit-of-work-mikro-orm';
import { CustomerMYSQLRepository } from '../infra/repositories/customer-mysql.repository';
import { PartnerMYSQLRepository } from '../infra/repositories/partner-mysql.repository';
import { EventMYSQLRepository } from '../infra/repositories/event-mysql.repository';
import { Customer } from '../domain/entities/customer.entity';
import { Partner } from '../domain/entities/partner.entity';
import { OrderMYSQLRepository } from '../infra/repositories/order-mysql.repository';
import { SpotReservationMYSQLRepository } from '../infra/repositories/spot-reservation-mysql.repository';
import { OrderService } from './order.service';

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init<MySqlDriver>({
    entities: [
      CustomerSchema,
      PartnerSchema,
      EventSchema,
      EventSectionSchema,
      EventSpotSchema,
      OrderSchema,
      SpotReservationSchema,
    ],
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

test('should create Order by service', async () => {
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();
  const unitOfWork = new UnitOfWorkMikroOrm(em);
  const customerRepo = new CustomerMYSQLRepository(em);
  const partnerRepo = new PartnerMYSQLRepository(em);
  const eventRepo = new EventMYSQLRepository(em);
  const customer = Customer.create({
    name: 'Tony Amaral',
    cpf: '70375887091',
  });
  await customerRepo.add(customer);

  const partner = Partner.create({
    name: 'Partner 1',
  });

  await partnerRepo.add(partner);

  const event = partner.initEvent({
    name: 'Event 1',
    description: 'Simple event',
    date: new Date(),
  });

  event.addSection({
    name: 'Section',
    price: 150,
    total_spots: 10,
    description: 'Section Description',
  });

  event.publishAll();

  await eventRepo.add(event);

  await unitOfWork.commit();
  em.clear();

  const orderRepo = new OrderMYSQLRepository(em);
  const spotReservationRepo = new SpotReservationMYSQLRepository(em);
  const orderService = new OrderService(
    orderRepo,
    customerRepo,
    eventRepo,
    spotReservationRepo,
    unitOfWork,
  );

  await orderService.create({
    event_id: event.id.value,
    section_id: event.sections[0].id.value,
    customer_id: customer.id.value,
    spot_id: event.sections[0].spots[0].id.value,
  });
});
