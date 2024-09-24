import { EntityManager } from '@mikro-orm/mysql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { UnitOfWorkMikroOrm } from '../@core/common/infra/unit-of-work-mikro-orm';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from '../@core/events-domain/infra/db/schemas';
import { UOWProvider } from '../utils/enums/providers';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRoot({
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
      type: 'mysql',
    }),
  ],
  providers: [
    {
      provide: UOWProvider.UOW,
      useFactory(em: EntityManager) {
        return new UnitOfWorkMikroOrm(em);
      },
      inject: [EntityManager],
    },
  ],
  exports: [UOWProvider.UOW],
})
export class DatabaseModule {}
