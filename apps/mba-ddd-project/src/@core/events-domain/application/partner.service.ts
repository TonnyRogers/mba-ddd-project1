import { Partner } from '../domain/entities/partner.entity';
import { IPartnerRepository } from '../domain/repositories/partner-repository.interface';
import { ApplicationService } from '../../../@core/common/application/application.service';

export class PartnerService {
  constructor(
    private partnerRepo: IPartnerRepository,
    private applicationService: ApplicationService,
  ) {}

  list(): Promise<Partner[]> {
    return this.partnerRepo.findAll();
  }

  async create(input: { name: string }): Promise<Partner> {
    return await this.applicationService.run(async () => {
      const partner = Partner.create(input);
      await this.partnerRepo.add(partner);
      return partner;
    });
  }

  async update(id: string, input: { name?: string }): Promise<Partner> {
    return await this.applicationService.run(async () => {
      const partner = await this.partnerRepo.findById(id);

      if (!partner) {
        throw new Error('Partner not found');
      }

      input.name && partner.changeName(input.name);

      await this.partnerRepo.add(partner);
      return partner;
    });
  }
}
