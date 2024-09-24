import { MikroORM } from '@mikro-orm/mysql';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from '../../../../../@core/events-domain/infra/db/schemas';

export function initOrm() {
  beforeAll(async () => {
    await MikroORM.init(
      {
        allowGlobalContext: true,
        entities: [
          CustomerSchema,
          PartnerSchema,
          EventSchema,
          EventSectionSchema,
          EventSpotSchema,
          OrderSchema,
          SpotReservationSchema,
        ],
        type: 'mysql',
        dbName: 'fake',
      },
      false,
    );
  });
}
