/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityProperty, Platform, Type } from '@mikro-orm/core';
import Cpf from '../../../../../@core/common/domain/value-objects/cpf.vo';

export class CpfSchemaType extends Type<Cpf, string> {
  convertToDatabaseValue(
    valueObject: Cpf | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof Cpf
      ? valueObject.value
      : (valueObject as string);
  }

  convertToJSValue(value: string, platform: Platform): Cpf {
    return new Cpf(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform): string {
    return `VARCHAR(11)`;
  }
}
