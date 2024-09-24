import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqModule } from 'apps/mba-ddd-project/src/rabbitmq/rabbitmq.module';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://admin:admin@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
    RabbitmqModule,
  ],
  controllers: [EmailsController],
  providers: [EmailsService, ConsumerService],
})
export class EmailsModule {}
