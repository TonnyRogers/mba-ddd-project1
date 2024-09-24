/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityProperty, Platform, Type } from '@mikro-orm/core';
import { ValueObject } from '../../../../../@core/common/domain/value-objects/value-object';
import { PartnerId } from '../../../../../@core/events-domain/domain/entities/partner.entity';

export class PartnerIdSchemaType extends Type<PartnerId, string> {
  convertToDatabaseValue(
    valueObject: PartnerId | undefined | null,
    platform: Platform,
  ): string {
    return ValueObject instanceof PartnerId
      ? valueObject.value
      : (valueObject as unknown as string);
  }

  convertToJSValue(value: string, platform: Platform): PartnerId {
    return new PartnerId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform): string {
    return 'varchar(36)';
  }
}
