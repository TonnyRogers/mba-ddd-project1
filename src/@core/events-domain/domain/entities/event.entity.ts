import Uuid from 'src/@core/common/domain/value-objects/uuid.vo';
import { PartnerId } from './partner.entity';
import { AggregateRoot } from 'src/@core/common/domain/aggregate-root';
import { EventSection } from './event-section.entity';
import {
  AnyCollection,
  ICollection,
  MyCollectionFactory,
} from 'src/@core/common/domain/my-collection';

/**
 *  event - Aggregate
 *    sections - basic, vip (price)
 *      spots - reserved, not reserved, location
 */

export class EventId extends Uuid {}

export type CreateEventCommand = {
  name: string;
  description?: string | null;
  date: Date;
  partner_id: PartnerId;
};

export type AddSectionCommand = {
  name: string;
  description?: string | null;
  total_spots: number;
  price: number;
};

export type EventConstructorProps = {
  id?: EventId | string;
  name: string;
  description: string | null;
  date: Date;
  is_published: boolean;

  total_spots: number;
  total_spots_reserved: number;
  partner_id: PartnerId;
};

export class Event extends AggregateRoot {
  id: EventId | string;
  name: string;
  description: string | null;
  date: Date;
  is_published: boolean;

  total_spots: number;
  total_spots_reserved: number;
  partner_id: PartnerId | string;
  private _sections: ICollection<EventSection>;

  constructor(props: EventConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new EventId(props.id)
        : (props.id ?? new EventId());

    this.name = props.name;
    this.description = props.description;
    this.date = props.date;
    this.is_published = props.is_published;
    this.total_spots = props.total_spots;
    this.total_spots_reserved = props.total_spots_reserved;
    this.partner_id =
      props.partner_id instanceof PartnerId
        ? props.partner_id
        : new PartnerId(props.partner_id);
    this._sections = MyCollectionFactory.create<EventSection>(this);
  }

  static create(command: CreateEventCommand) {
    return new Event({
      ...command,
      description: command.description ?? null,
      is_published: false,
      total_spots: 0,
      total_spots_reserved: 0,
    });
  }

  publishAll() {
    this.publish();
    this._sections.forEach((section) => section.publishAll());
  }

  publish() {
    this.is_published = true;
  }

  unpublish() {
    this.is_published = false;
  }

  addSection(command: AddSectionCommand) {
    const section = EventSection.create(command);
    this._sections.add(section);
    this.total_spots += section.total_spots;
  }

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string) {
    this.description = description;
  }

  changeDate(date: Date) {
    this.date = date;
  }

  get sections(): ICollection<EventSection> {
    return this._sections as ICollection<EventSection>;
  }

  set sections(sections: AnyCollection<EventSection>) {
    this._sections = MyCollectionFactory.createFrom<EventSection>(sections);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      date: this.date,
      is_published: this.is_published,
      total_spots: this.total_spots,
      total_spots_reserved: this.total_spots_reserved,
      partner_id: this.partner_id,
      sections: [...this._sections].map((section) => section.toJSON()),
    };
  }
}
