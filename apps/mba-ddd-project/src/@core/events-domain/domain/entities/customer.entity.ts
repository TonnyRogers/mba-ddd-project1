import { AggregateRoot } from '../../../../@core/common/domain/aggregate-root';
import Cpf from '../../../../@core/common/domain/value-objects/cpf.vo';
import Uuid from '../../../../@core/common/domain/value-objects/uuid.vo';

export class CustomerId extends Uuid {}

export type CustomerConstructorProps = {
  id?: CustomerId | string;
  cpf: Cpf;
  name: string;
};

export class Customer extends AggregateRoot {
  id: CustomerId;
  cpf: Cpf;
  name: string;

  // used to hydrate the class
  constructor(props: CustomerConstructorProps) {
    super();

    this.id =
      typeof props.id === 'string'
        ? new CustomerId(props.id)
        : (props.id ?? new CustomerId());
    this.cpf = props.cpf;
    this.name = props.name;
  }

  // used to create new
  static create(commad: { name: string; cpf: string }) {
    return new Customer({
      name: commad.name,
      cpf: new Cpf(commad.cpf),
    });
  }

  changeName(name: string) {
    this.name = name;
  }

  toJSON() {
    return {
      id: this.id.value,
      cpf: this.cpf.value,
      name: this.name,
    };
  }
}
