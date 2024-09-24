import { Body, Controller, Get, Post } from '@nestjs/common';
import { PartnerService } from '../../@core/events-domain/application/partner.service';

@Controller('partners')
export class PartnersController {
  constructor(private partnerService: PartnerService) {}

  @Post()
  create(@Body() body: { name: string }) {
    return this.partnerService.create(body);
  }

  @Get()
  list() {
    return this.partnerService.list();
  }
}
