import { AggregateRoot } from 'src/@core/common/domain/aggregate-root';
import { Event } from './event.entity';
import Uuid from 'src/@core/common/domain/value-objects/uuid.vo';

export class PartnerId extends Uuid {}

export type PartnerConstructorProps = {
  id?: PartnerId | string;
  name: string;
};

export type InitEventCommand = {
  name: string;
  description?: string | null;
  date: Date;
};

export class Partner extends AggregateRoot {
  id: PartnerId;
  name: string;

  constructor(props: PartnerConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new PartnerId(props.id)
        : (props.id ?? new PartnerId());

    this.name = props.name;
  }

  static create(command: { name: string }) {
    return new Partner({
      name: command.name,
    });
  }

  changeName(name: string) {
    this.name = name;
  }

  initEvent(command: InitEventCommand) {
    return Event.create({
      ...command,
      partner_id: this.id,
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
