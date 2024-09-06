import { EntityManager } from '@mikro-orm/mysql';
import { IUnitOfWork } from '../application/unit-of-work.interface';
import { AggregateRoot } from '../domain/aggregate-root';

export class UnitOfWorkMikroOrm implements IUnitOfWork {
  constructor(private em: EntityManager) {}

  getAggregateRoots(): AggregateRoot[] {
    return [
      ...this.em.getUnitOfWork().getPersistStack(),
      ...this.em.getUnitOfWork().getRemoveStack(),
    ] as AggregateRoot[];
  }

  runTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.em.transactional(callback);
  }

  beginTransaction(): Promise<void> {
    return this.em.begin();
  }

  completeTransaction(): Promise<void> {
    return this.em.commit();
  }

  rollbackTransaction(): Promise<void> {
    return this.em.rollback();
  }

  commit(): Promise<void> {
    return this.em.flush();
  }

  async rollback(): Promise<void> {
    this.em.clear();
  }
}
