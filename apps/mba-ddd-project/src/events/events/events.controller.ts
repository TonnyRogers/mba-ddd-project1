import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EventService } from '../../@core/events-domain/application/event.service';
import { EventDto } from './event.dto';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Post()
  create(
    @Body()
    body: EventDto,
  ) {
    return this.eventService.create(body);
  }

  @Get()
  list() {
    return this.eventService.findEvents();
  }

  @Put(':event_id/publish-all')
  publish(@Param('event_id') event_id: string) {
    return this.eventService.publishAll({ event_id });
  }
}
