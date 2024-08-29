import { EntityManager } from '@mikro-orm/mysql';
import { IOrderRepository } from '../../domain/repositories/order-repository.interface';
import { Order, OrderId } from '../../domain/entities/order.entity';

export class OrderMYSQLRepository implements IOrderRepository {
  constructor(private entityManager: EntityManager) {}

  async add(entity: Order): Promise<void> {
    this.entityManager.persist(entity);
  }

  async findById(id: any): Promise<Order> {
    return this.entityManager.findOne(Order, {
      id: typeof id === 'string' ? new OrderId(id) : id,
    });
  }

  async findAll(): Promise<Order[]> {
    return this.entityManager.find(Order, {});
  }

  async delete(entity: Order): Promise<void> {
    await this.entityManager.remove(entity);
  }
}
