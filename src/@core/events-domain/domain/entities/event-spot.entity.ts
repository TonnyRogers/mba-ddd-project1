import { Entity } from 'src/@core/common/domain/entity';
import Uuid from 'src/@core/common/domain/value-objects/uuid.vo';

export class EventSpotId extends Uuid {}

export type EventSpotConstructorProps = {
  id?: EventSpotId | string;
  location: string | null;
  is_published: boolean;
  is_reserved: boolean;
};

export class EventSpot extends Entity {
  id: EventSpotId;
  location: string | null;
  is_published: boolean;
  is_reserved: boolean;

  constructor(props: EventSpotConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new EventSpotId(props.id)
        : (props.id ?? new EventSpotId());

    this.location = props.location;
    this.is_reserved = props.is_reserved;
    this.is_published = props.is_published;
  }

  static create() {
    return new EventSpot({
      location: null,
      is_published: false,
      is_reserved: false,
    });
  }

  changeLocation(location: string) {
    this.location = location;
  }

  publish() {
    this.is_published = true;
  }

  unpublish() {
    this.is_published = false;
  }

  markAsReserved() {
    this.is_reserved = true;
  }

  toJSON() {
    return {
      id: this.id,
      location: this.location,
      is_published: this.is_published,
      is_reserved: this.is_reserved,
    };
  }
}
