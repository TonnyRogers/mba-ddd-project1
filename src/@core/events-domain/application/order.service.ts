import { IUnitOfWork } from 'src/@core/common/application/unit-of-work.interface';
import { IOrderRepository } from '../domain/repositories/order-repository.interface';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';
import { IEventRepository } from '../domain/repositories/event-repository.interface';
import { EventSectionId } from '../domain/entities/event-section.entity';
import { EventSpotId } from '../domain/entities/event-spot.entity';
import { ISpotReservationRepository } from '../domain/repositories/spot-reservation-repository.interface.ts';
import { SpotReservation } from '../domain/entities/spot-reservation.entity';
import { Order } from '../domain/entities/order.entity';
import { PaymentGateway } from './payment.gateway';

export class OrderService {
  constructor(
    private orderRepo: IOrderRepository,
    private customerRepo: ICustomerRepository,
    private eventRepo: IEventRepository,
    private spotReservationRepo: ISpotReservationRepository,
    private uow: IUnitOfWork,
    private paymentGateway: PaymentGateway,
  ) {}

  list() {
    return this.orderRepo.findAll();
  }

  async create(input: {
    customer_id: string;
    event_id: string;
    section_id: string;
    spot_id: string;
    card_token: string;
  }) {
    const customer = await this.customerRepo.findById(input.customer_id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const event = await this.eventRepo.findById(input.event_id);

    if (!event) {
      throw new Error('Event not found');
    }

    const sectionId = new EventSectionId(input.section_id);
    const spotId = new EventSpotId(input.spot_id);

    if (!event.allowReserveSpot({ section_id: sectionId, spot_id: spotId })) {
      throw new Error('Spot not available');
    }

    const spotReservation = await this.spotReservationRepo.findById(spotId);

    if (spotReservation) {
      throw new Error('Spot already reserved');
    }

    await this.uow.runTransaction(async () => {
      const spotReservationCreated = SpotReservation.create({
        customer_id: customer.id,
        spot_id: spotId,
      });

      await this.spotReservationRepo.add(spotReservationCreated);
      try {
        this.uow.commit();

        const section = event.sections.find((s) => s.id.equals(sectionId));
        await this.paymentGateway.payment({
          token: input.card_token,
          amount: section.price,
        });

        const order = Order.create({
          customer_id: customer.id,
          event_spot_id: spotId,
          amount: section.price,
        });
        order.pay();

        await this.orderRepo.add(order);

        event.markSpotAsReserved({
          section_id: sectionId,
          spot_id: spotId,
        });

        this.eventRepo.add(event);
        this.uow.commit();

        return order;
      } catch (error) {
        const section = event.sections.find((s) => s.id.equals(sectionId));

        const order = Order.create({
          customer_id: customer.id,
          event_spot_id: spotId,
          amount: section.price,
        });

        order.cancel();
        this.uow.commit();
        throw new Error('Error on reserve new spot');
      }
    });
  }
}
