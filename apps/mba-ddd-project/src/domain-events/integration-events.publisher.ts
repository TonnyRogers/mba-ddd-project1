import { Process, Processor } from '@nestjs/bull';
import { QueueNameProviders } from '../utils/enums/providers';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Job } from 'bull';
import { IIntegrationEvent } from '../@core/common/domain/integration-events';

@Processor(QueueNameProviders.INTEGRATION_EVENTS)
export class IntegrationEventsPublisher {
  constructor(private amqpConnection: AmqpConnection) {}

  @Process()
  async handle(job: Job<IIntegrationEvent>) {
    console.log(`PROCESS`, job);

    await this.amqpConnection.publish(
      'amq.direct',
      job.data.event_name,
      job.data,
    );
    return {};
  }
}
