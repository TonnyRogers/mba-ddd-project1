import { Partner } from '../partner.entity';
import { initOrm } from './helpers';

describe('Partner Entity', () => {
  initOrm();

  test('should create an event through partner', () => {
    const partner = Partner.create({
      name: 'Bruce',
    });

    const event = partner.initEvent({
      name: 'Teatro Hall',
      date: new Date(),
      description: 'Peça de Teatro',
    });

    expect(event).toBeTruthy();
  });
});
