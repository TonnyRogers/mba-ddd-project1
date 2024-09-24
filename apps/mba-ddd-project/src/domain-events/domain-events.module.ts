import { Global, Module, OnModuleInit } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/mysql';
import { ModuleRef } from '@nestjs/core';

import { DomainEventManager } from '../@core/common/domain/domain-event-manager';
import { IntegrationEventsPublisher } from './integration-events.publisher';
import { StoredEventProviders } from '../utils/enums/providers';
import { StoredEventMysqlRepository } from '../@core/stored-events/infra/db/repositories/stored-event-mysql.repository';
import { IDomainEvent } from '../@core/common/domain/domain-event';
import { StoredEventSchema } from '../@core/stored-events/infra/db/schemas';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([StoredEventSchema])],
  providers: [
    DomainEventManager,
    IntegrationEventsPublisher,
    {
      provide: StoredEventProviders.REPOSITORY,
      useFactory: (em) => new StoredEventMysqlRepository(em),
      inject: [EntityManager],
    },
  ],
  exports: [DomainEventManager],
})
export class DomainEventsModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.domainEventManager.register('*', async (event: IDomainEvent) => {
      const repo = await this.moduleRef.resolve(
        StoredEventProviders.REPOSITORY,
      );
      await repo.add(event);
    });
  }
}
