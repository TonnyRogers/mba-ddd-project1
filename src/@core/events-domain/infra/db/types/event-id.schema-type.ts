/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityProperty, Platform, Type } from '@mikro-orm/core';
import { EventId } from 'src/@core/events-domain/domain/entities/event.entity';

export class EventIdSchemaType extends Type<EventId, string> {
  convertToDatabaseValue(
    valueObject: EventId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof EventId
      ? valueObject.value
      : (valueObject as string);
  }

  convertToJSValue(value: string, platform: Platform): EventId {
    return new EventId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform): string {
    return `VARCHAR(36)`;
  }
}
