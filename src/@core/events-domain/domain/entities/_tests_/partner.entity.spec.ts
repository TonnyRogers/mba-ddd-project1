import { Partner } from '../partner.entity';

test('should create an event throug partner', () => {
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
