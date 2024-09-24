import { EntityManager } from '@mikro-orm/mysql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnModuleInit } from '@nestjs/common';
import { IUnitOfWork } from '../@core/common/application/unit-of-work.interface';
import { CustomerService } from '../@core/events-domain/application/customer.service';
import { EventService } from '../@core/events-domain/application/event.service';
import { OrderService } from '../@core/events-domain/application/order.service';
import { PartnerService } from '../@core/events-domain/application/partner.service';
import { PaymentGateway } from '../@core/events-domain/application/payment.gateway';
import { ICustomerRepository } from '../@core/events-domain/domain/repositories/customer-repository.interface';
import { IEventRepository } from '../@core/events-domain/domain/repositories/event-repository.interface';
import { IOrderRepository } from '../@core/events-domain/domain/repositories/order-repository.interface';
import { IPartnerRepository } from '../@core/events-domain/domain/repositories/partner-repository.interface';
import { ISpotReservationRepository } from '../@core/events-domain/domain/repositories/spot-reservation-repository.interface.ts';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from '../@core/events-domain/infra/db/schemas';
import { CustomerMYSQLRepository } from '../@core/events-domain/infra/repositories/customer-mysql.repository';
import { EventMYSQLRepository } from '../@core/events-domain/infra/repositories/event-mysql.repository';
import { OrderMYSQLRepository } from '../@core/events-domain/infra/repositories/order-mysql.repository';
import { PartnerMYSQLRepository } from '../@core/events-domain/infra/repositories/partner-mysql.repository';
import { SpotReservationMYSQLRepository } from '../@core/events-domain/infra/repositories/spot-reservation-mysql.repository';
import {
  CustomerProvider,
  EventProvider,
  OrderProvider,
  PartnerProvider,
  QueueNameProviders,
  SpotReservationProvider,
  UOWProvider,
} from '../utils/enums/providers';
import { PartnersController } from './partners/partners.controller';
import { CustomersController } from './customers/customers.controller';
import { OrdersController } from './orders/orders.controller';
import { EventsController } from './events/events.controller';
import { EventSectionsController } from './events/event-section.controller';
import { EventSpotsController } from './events/event-spot.controller';
import { ApplicationModule } from '../application/application.module';
import { ApplicationService } from '../@core/common/application/application.service';
import { DomainEventManager } from '../@core/common/domain/domain-event-manager';
import { MyHandlerHandler } from '../@core/events-domain/application/handlers/my-handler.handler';
import { ModuleRef } from '@nestjs/core';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IIntegrationEvent } from '../@core/common/domain/integration-events';
import { PartnerCreated } from '../@core/events-domain/domain/domain-events/partner-created.event';
import { PartnerCreatedIntegrationEvent } from '../@core/events-domain/domain/integration-events/partner-created.int-events';

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
    ApplicationModule,
    BullModule.registerQueue({
      name: QueueNameProviders.INTEGRATION_EVENTS,
    }),
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
      useFactory: (repo: IPartnerRepository, appService: ApplicationService) =>
        new PartnerService(repo, appService),
      inject: [PartnerProvider.REPOSITORY, ApplicationService],
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
    {
      provide: MyHandlerHandler,
      useFactory: (
        partnerRepo: IPartnerRepository,
        domainEventManager: DomainEventManager,
      ) => new MyHandlerHandler(partnerRepo, domainEventManager),
      inject: [PartnerProvider.REPOSITORY, DomainEventManager],
    },
  ],
  controllers: [
    PartnersController,
    CustomersController,
    OrdersController,
    EventsController,
    EventSectionsController,
    EventSpotsController,
  ],
})
export class EventsModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
    @InjectQueue(QueueNameProviders.INTEGRATION_EVENTS)
    private integrationEventQueue: Queue<IIntegrationEvent>,
  ) {}

  onModuleInit() {
    MyHandlerHandler.listensTo().forEach((eventName: string) => {
      this.domainEventManager.register(eventName, async (event) => {
        const handler = await this.moduleRef.resolve(MyHandlerHandler);
        await handler.handle(event);
      });
    });
    this.domainEventManager.register(PartnerCreated.name, async (event) => {
      console.log(`EVENT`, event);

      const integrationEvent = new PartnerCreatedIntegrationEvent(event);
      await this.integrationEventQueue.add(integrationEvent);
    });
  }
}
