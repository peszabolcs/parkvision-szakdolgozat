import { rest } from 'msw';
import type { Area } from '../../types';

const mockAreas: Area[] = [
  {
    id: 'area-1',
    name: 'Zone A - Ground Floor',
    description: 'Ground floor parking area',
    capacity: 20,
    occupied: 16,
    status: 'active',
  },
  {
    id: 'area-2',
    name: 'Zone B - Level 1',
    description: 'First level parking area',
    capacity: 25,
    occupied: 15,
    status: 'active',
  },
  {
    id: 'area-3',
    name: 'Zone C - Level 2',
    description: 'Second level parking area',
    capacity: 30,
    occupied: 10,
    status: 'active',
  },
  {
    id: 'area-4',
    name: 'Zone D - VIP Section',
    description: 'Reserved VIP parking',
    capacity: 10,
    occupied: 8,
    status: 'active',
  },
  {
    id: 'area-5',
    name: 'Zone E - Electric Charging',
    description: 'EV charging stations',
    capacity: 15,
    occupied: 5,
    status: 'active',
  },
];

const MOCK_SCENARIO = import.meta.env.VITE_MOCK_SCENARIO || 'normal';

export const areasHandlers = [
  rest.get('/api/areas', (_req, res, ctx) => {
    if (MOCK_SCENARIO === 'error') {
      return res(
        ctx.status(500),
        ctx.json({ message: 'Internal Server Error' })
      );
    }

    if (MOCK_SCENARIO === 'empty') {
      return res(ctx.status(200), ctx.json([]));
    }

    return res(ctx.delay(200), ctx.status(200), ctx.json(mockAreas));
  }),
];
