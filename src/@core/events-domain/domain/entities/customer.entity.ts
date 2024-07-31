import { AggregateRoot } from 'src/@core/common/domain/aggregate-root';
import Cpf from 'src/@core/common/domain/value-objects/cpf.vo';

export type CustomerConstructorProps = {
  id?: string;
  cpf: Cpf;
  name: string;
};

export class Customer extends AggregateRoot {
  id: string;
  cpf: Cpf;
  name: string;

  // used to hydrate the class
  constructor(props: CustomerConstructorProps) {
    super();

    this.id = props.id;
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

  toJSON() {
    return {
      id: this.id,
      cpf: this.cpf,
      name: this.name,
    };
  }
}
