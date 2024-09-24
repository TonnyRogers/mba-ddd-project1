import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from './@core/events-domain/infra/db/schemas';
import { StoredEventSchema } from './@core/stored-events/infra/db/schemas';

export default {
  entities: [
    CustomerSchema,
    PartnerSchema,
    EventSchema,
    EventSectionSchema,
    EventSpotSchema,
    OrderSchema,
    SpotReservationSchema,
    StoredEventSchema,
  ],
  dbName: 'events',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  type: 'mysql',
};
