import { EntityManager } from '@mikro-orm/mysql';
import { IStoredEventRepository } from '../../../domain/repositories/stored-events.repository';

import { IDomainEvent } from 'apps/mba-ddd-project/src/@core/common/domain/domain-event';
import {
  StoredEvent,
  StoredEventId,
} from '../../../domain/entities/stored-event.entity';

export class StoredEventMysqlRepository implements IStoredEventRepository {
  constructor(private entityManager: EntityManager) {}

  allBetween(
    lowEventId: StoredEventId,
    highEventId: StoredEventId,
  ): Promise<StoredEvent[]> {
    return this.entityManager.find(StoredEvent, {
      id: { $gte: lowEventId, $lte: highEventId },
    });
  }

  allSince(eventId: StoredEventId): Promise<StoredEvent[]> {
    return this.entityManager.find(StoredEvent, { id: { $gte: eventId } });
  }

  add(domainEvent: IDomainEvent): StoredEvent {
    const storedEvent = StoredEvent.create(domainEvent);
    this.entityManager.persist(storedEvent);
    return storedEvent;
  }
}
