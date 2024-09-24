import { Event } from '../event.entity';
import { PartnerId } from '../partner.entity';
import { initOrm } from './helpers';

describe('', () => {
  initOrm();

  test('should create an event', () => {
    const event = Event.create({
      name: 'Show do milhão',
      description: 'um show show com Silvio Santos',
      date: new Date(),
      partner_id: new PartnerId(),
    });

    event.addSection({
      name: 'Sessão A1',
      price: 25000,
      total_spots: 30,
      description: 'Sessão primária',
    });

    const [section] = event.sections;

    expect(event.sections.count()).toBe(1);
    expect(event.total_spots).toBe(30);
    expect(section.spots.count()).toBe(30);
  });

  test('should publish all event itens', () => {
    const event = Event.create({
      name: 'Musical de Natal',
      date: new Date('2024-12-20'),
      partner_id: new PartnerId(),
      description: 'Descrição do musical',
    });

    event.addSection({
      name: 'Hall Premium',
      description: 'para alta classe',
      price: 100000,
      total_spots: 30,
    });

    event.addSection({
      name: 'Mid Profile',
      description: 'nem tão alta classe assim',
      price: 500,
      total_spots: 200,
    });

    event.publishAll();
    const [section1, section2] = event.sections.getItems();

    expect(event.is_published).toBe(true);
    expect(section1.is_published).toBe(true);
    expect(section2.is_published).toBe(true);

    [...section1.spots, ...section2.spots].forEach((spot) => {
      expect(spot.is_published).toBe(true);
    });
  });
});
