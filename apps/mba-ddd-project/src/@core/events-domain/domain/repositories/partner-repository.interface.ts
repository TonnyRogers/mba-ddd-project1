import { IRepository } from '../../../../@core/common/domain/repository-interface';
import { Partner, PartnerId } from '../entities/partner.entity';

export interface IPartnerRepository extends IRepository<Partner> {
  findById(id: string | PartnerId): Promise<Partner>;
}
