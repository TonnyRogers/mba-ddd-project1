import { EntityManager } from '@mikro-orm/mysql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { IUnitOfWork } from 'src/@core/common/application/unit-of-work.interface';
import { CustomerService } from 'src/@core/events-domain/application/customer.service';
import { EventService } from 'src/@core/events-domain/application/event.service';
import { OrderService } from 'src/@core/events-domain/application/order.service';
import { PartnerService } from 'src/@core/events-domain/application/partner.service';
import { PaymentGateway } from 'src/@core/events-domain/application/payment.gateway';
import { ICustomerRepository } from 'src/@core/events-domain/domain/repositories/customer-repository.interface';
import { IEventRepository } from 'src/@core/events-domain/domain/repositories/event-repository.interface';
import { IOrderRepository } from 'src/@core/events-domain/domain/repositories/order-repository.interface';
import { IPartnerRepository } from 'src/@core/events-domain/domain/repositories/partner-repository.interface';
import { ISpotReservationRepository } from 'src/@core/events-domain/domain/repositories/spot-reservation-repository.interface.ts';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from 'src/@core/events-domain/infra/db/schemas';
import { CustomerMYSQLRepository } from 'src/@core/events-domain/infra/repositories/customer-mysql.repository';
import { EventMYSQLRepository } from 'src/@core/events-domain/infra/repositories/event-mysql.repository';
import { OrderMYSQLRepository } from 'src/@core/events-domain/infra/repositories/order-mysql.repository';
import { PartnerMYSQLRepository } from 'src/@core/events-domain/infra/repositories/partner-mysql.repository';
import { SpotReservationMYSQLRepository } from 'src/@core/events-domain/infra/repositories/spot-reservation-mysql.repository';
import {
  CustomerProvider,
  EventProvider,
  OrderProvider,
  PartnerProvider,
  SpotReservationProvider,
  UOWProvider,
} from 'src/utils/enums/providers';
import { PartnersController } from './partners/partners.controller';
import { CustomersController } from './customers/customers.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CustomerSchema,
      PartnerSchema,
      EventSchema,
      EventSectionSchema,
      EventSpotSchema,
      OrderSchema,
      SpotReservationSchema,
    ]),
  ],
  providers: [
    {
      provide: CustomerProvider.REPOSITORY,
      useFactory: (em: EntityManager) => new CustomerMYSQLRepository(em),
      inject: [EntityManager],
    },
    {
      provide: PartnerProvider.REPOSITORY,
      useFactory: (em: EntityManager) => new PartnerMYSQLRepository(em),
      inject: [EntityManager],
    },
    {
      provide: EventProvider.REPOSITORY,
      useFactory: (em: EntityManager) => new EventMYSQLRepository(em),
      inject: [EntityManager],
    },
    {
      provide: OrderProvider.REPOSITORY,
      useFactory: (em: EntityManager) => new OrderMYSQLRepository(em),
      inject: [EntityManager],
    },
    {
      provide: SpotReservationProvider.REPOSITORY,
      useFactory: (em: EntityManager) => new SpotReservationMYSQLRepository(em),
      inject: [EntityManager],
    },
    {
      provide: CustomerService,
      useFactory: (repo: ICustomerRepository, uow: IUnitOfWork) =>
        new CustomerService(repo, uow),
      inject: [CustomerProvider.REPOSITORY, UOWProvider.UOW],
    },
    {
      provide: PartnerService,
      useFactory: (repo: IPartnerRepository, uow: IUnitOfWork) =>
        new PartnerService(repo, uow),
      inject: [PartnerProvider.REPOSITORY, UOWProvider.UOW],
    },
    {
      provide: EventService,
      useFactory: (
        repo: IEventRepository,
        partnerRepo: IPartnerRepository,
        uow: IUnitOfWork,
      ) => new EventService(repo, partnerRepo, uow),
      inject: [
        EventProvider.REPOSITORY,
        PartnerProvider.REPOSITORY,
        UOWProvider.UOW,
      ],
    },
    PaymentGateway,
    {
      provide: OrderService,
      useFactory: (
        repo: IOrderRepository,
        customerRepo: ICustomerRepository,
        eventRepo: IEventRepository,
        spotReservationRepo: ISpotReservationRepository,
        uow: IUnitOfWork,
        paymentGateway: PaymentGateway,
      ) =>
        new OrderService(
          repo,
          customerRepo,
          eventRepo,
          spotReservationRepo,
          uow,
          paymentGateway,
        ),
      inject: [
        OrderProvider.REPOSITORY,
        CustomerProvider.REPOSITORY,
        EventProvider.REPOSITORY,
        SpotReservationProvider.REPOSITORY,
        UOWProvider.UOW,
        PaymentGateway,
      ],
    },
  ],
  controllers: [PartnersController, CustomersController],
})
export class EventsModule {}
