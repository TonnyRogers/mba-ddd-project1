import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EventService } from 'src/@core/events-domain/application/event.service';

@Controller('events/:event_id/sections')
export class EventSectionsController {
  constructor(private eventService: EventService) {}

  @Post()
  create(
    @Param('event_id') event_id: string,
    @Body()
    body: {
      name: string;
      description?: string | null;
      total_spots: number;
      price: number;
    },
  ) {
    return this.eventService.addSection({
      ...body,
      event_id: event_id,
    });
  }

  @Get()
  list(@Param('event_id') event_id: string) {
    return this.eventService.findSections(event_id);
  }

  @Put(':section_id')
  update(
    @Param('event_id') event_id: string,
    @Param('section_id') section_id: string,
    @Body()
    body: {
      name: string;
      description?: string | null;
    },
  ) {
    return this.eventService.updateSection({
      ...body,
      event_id,
      section_id,
    });
  }
}
