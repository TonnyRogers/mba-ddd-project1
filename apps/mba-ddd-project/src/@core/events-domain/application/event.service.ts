import { IUnitOfWork } from '../../../@core/common/application/unit-of-work.interface';
import { IEventRepository } from '../domain/repositories/event-repository.interface';
import { IPartnerRepository } from '../domain/repositories/partner-repository.interface';
import { EventSectionId } from '../domain/entities/event-section.entity';
import { EventSpotId } from '../domain/entities/event-spot.entity';

export class EventService {
  constructor(
    private eventRepo: IEventRepository,
    private partnerRepo: IPartnerRepository,
    private uow: IUnitOfWork,
  ) {}

  async findEvents() {
    return this.eventRepo.findAll();
  }

  async findSections(event_id: string) {
    const event = await this.eventRepo.findById(event_id);

    return event.sections;
  }

  async create(input: {
    name: string;
    date: Date;
    partner_id: string;
    description?: string | null;
  }) {
    const partner = await this.partnerRepo.findById(input.partner_id);

    if (!partner) {
      throw new Error('Partner not found');
    }

    const event = partner.initEvent({
      date: input.date,
      name: input.name,
      description: input.description,
    });

    this.eventRepo.add(event);
    await this.uow.commit();
    return event;
  }

  async update(
    id: string,
    input: {
      name: string;
      date: Date;
      description?: string | null;
    },
  ) {
    const event = await this.eventRepo.findById(id);

    if (!event) {
      throw new Error('Event not found');
    }

    input.name && event.changeName(input.name);
    input.date && event.changeDate(input.date);
    input.description && event.changeDescription(input.description);

    this.eventRepo.add(event);
    await this.uow.commit();

    return event;
  }

  async addSection(input: {
    name: string;
    description?: string | null;
    total_spots: number;
    price: number;
    event_id: string;
  }) {
    const event = await this.eventRepo.findById(input.event_id);

    event.addSection({
      name: input.name,
      description: input.description,
      total_spots: input.total_spots,
      price: input.price,
    });
    await this.eventRepo.add(event);
    await this.uow.commit();
    return event;
  }

  async updateSection(input: {
    name: string;
    description?: string | null;
    event_id: string;
    section_id: string;
  }) {
    const event = await this.eventRepo.findById(input.event_id);

    if (!event) {
      throw new Error('Event not found');
    }

    const sectionId = new EventSectionId(input.section_id);
    event.changeSectionInformation({
      section_id: sectionId,
      name: input.name,
      description: input.description,
    });
    await this.eventRepo.add(event);
    await this.uow.commit();

    return event.sections;
  }

  async findSpots(input: { event_id: string; section_id: string }) {
    const event = await this.eventRepo.findById(input.event_id);

    if (!event) {
      throw new Error('Event not found');
    }

    const section = event.sections.find(
      (section) =>
        typeof section.id !== 'string' &&
        section.id.equals(new EventSectionId(input.section_id)),
    );

    if (!section) {
      throw new Error('Section not found');
    }

    return section.spots;
  }

  async updateLocation(input: {
    location: string;
    event_id: string;
    section_id: string;
    spot_id: string;
  }) {
    const event = await this.eventRepo.findById(input.event_id);
    const sectionId = new EventSectionId(input.section_id);
    const spotId = new EventSpotId(input.spot_id);

    event.changeLocation({
      section_id: sectionId,
      spot_id: spotId,
      location: input.location,
    });

    await this.eventRepo.add(event);

    const section = event.sections.find((section) =>
      section.id.equals(new EventSectionId(input.section_id)),
    );
    await this.uow.commit();

    return section.spots.find((spot) =>
      spot.id.equals(new EventSpotId(input.spot_id)),
    );
  }

  async publishAll(input: { event_id: string }) {
    const event = await this.eventRepo.findById(input.event_id);

    if (!event) {
      throw new Error('Event not found');
    }

    event.publishAll();
    await this.eventRepo.add(event);
    await this.uow.commit();

    return event;
  }
}
