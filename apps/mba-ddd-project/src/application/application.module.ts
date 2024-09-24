import { Module } from '@nestjs/common';
import { ApplicationService } from '../@core/common/application/application.service';
import { IUnitOfWork } from '../@core/common/application/unit-of-work.interface';
import { DomainEventManager } from '../@core/common/domain/domain-event-manager';
import { UOWProvider } from '../utils/enums/providers';

@Module({
  providers: [
    {
      provide: ApplicationService,
      useFactory: (
        uow: IUnitOfWork,
        domainEventManager: DomainEventManager,
      ) => {
        return new ApplicationService(uow, domainEventManager);
      },
      inject: [UOWProvider.UOW, DomainEventManager],
    },
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
