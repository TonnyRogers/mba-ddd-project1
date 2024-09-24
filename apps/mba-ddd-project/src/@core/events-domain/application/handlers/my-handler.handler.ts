import { IDomainEventHandler } from '../../../../@core/common/application/domain-event-handler.interface';
import { PartnerCreated } from '../../domain/domain-events/partner-created.event';
import { DomainEventManager } from '../../../../@core/common/domain/domain-event-manager';
import { IPartnerRepository } from '../../domain/repositories/partner-repository.interface';

export class MyHandlerHandler implements IDomainEventHandler {
  constructor(
    private partnerRepo: IPartnerRepository,
    private domainEventManager: DomainEventManager,
  ) {}

  static listensTo(): string[] {
    return [PartnerCreated.name];
  }

  async handle(event: PartnerCreated): Promise<void> {
    console.log(event);
  }
}
