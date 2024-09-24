import { IRepository } from '../../../../@core/common/domain/repository-interface';
import { SpotReservation } from '../entities/spot-reservation.entity';

export interface ISpotReservationRepository
  extends IRepository<SpotReservation> {}
