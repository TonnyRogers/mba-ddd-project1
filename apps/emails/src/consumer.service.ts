import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

export class ConsumerService {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'PartnerCreatedIntegrationEvent',
    // routingKey: 'events.fullcycle.com/*',
    queue: 'emails',
  })
  handle(msg: any) {
    console.log('ConsumerService.handler', msg);
  }
}
