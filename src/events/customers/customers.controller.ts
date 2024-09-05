import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerService } from 'src/@core/events-domain/application/customer.service';

@Controller('customers')
export class CustomersController {
  constructor(private cutomerService: CustomerService) {}

  @Post()
  create(@Body() body: { name: string; cpf: string }) {
    return this.cutomerService.register(body);
  }

  @Get()
  list() {
    return this.cutomerService.list();
  }
}
