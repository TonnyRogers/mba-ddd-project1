import Uuid from 'src/@core/common/domain/value-objects/uuid.vo';
import { CustomerId } from './customer.entity';
import { EventSpotId } from './event-spot.entity';
import { AggregateRoot } from 'src/@core/common/domain/aggregate-root';

export enum OrderStatus {
  PENDING,
  PAID,
  CANCELLED,
}

export class OrderId extends Uuid {}

export type OrderConstructProps = {
  id?: OrderId | string;
  customer_id: CustomerId;
  amount: number;
  event_spot_id: EventSpotId;
};

export class Order extends AggregateRoot {
  id: OrderId;
  customer_id: CustomerId;
  amount: number;
  event_spot_id: EventSpotId;
  status: OrderStatus = OrderStatus.PENDING;

  constructor(props: OrderConstructProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new OrderId(props.id)
        : (props.id ?? new OrderId());
    this.customer_id =
      props.customer_id instanceof CustomerId
        ? props.customer_id
        : new CustomerId(props.customer_id);
    this.amount = props.amount;
    this.event_spot_id =
      props.event_spot_id instanceof EventSpotId
        ? props.event_spot_id
        : new EventSpotId(props.event_spot_id);
  }

  static create(props: OrderConstructProps) {
    return new Order(props);
  }

  pay() {
    this.status = OrderStatus.PAID;
  }

  cancel() {
    this.status = OrderStatus.CANCELLED;
  }

  toJSON() {
    return {
      id: this.id.value,
      customer_id: this.customer_id.value,
      amount: this.amount,
      event_spot_id: this.event_spot_id.value,
    };
  }
}
