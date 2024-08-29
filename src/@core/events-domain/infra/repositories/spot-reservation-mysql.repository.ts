import { EntityManager } from '@mikro-orm/mysql';
import { ISpotReservationRepository } from '../../domain/repositories/spot-reservation-repository.interface.ts';
import { SpotReservation } from '../../domain/entities/spot-reservation.entity';
import { EventSpotId } from '../../domain/entities/event-spot.entity';

export class SpotReservationMYSQLRepository
  implements ISpotReservationRepository
{
  constructor(private entityManager: EntityManager) {}

  async add(entity: SpotReservation): Promise<void> {
    this.entityManager.persist(entity);
  }

  async findById(spot_id: EventSpotId | string): Promise<SpotReservation> {
    return this.entityManager.findOne(SpotReservation, {
      spot_id: typeof spot_id === 'string' ? new EventSpotId(spot_id) : spot_id,
    });
  }

  async findAll(): Promise<SpotReservation[]> {
    return this.entityManager.find(SpotReservation, {});
  }

  async delete(entity: SpotReservation): Promise<void> {
    await this.entityManager.remove(entity);
  }
}
