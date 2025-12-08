import { parkingSpacesHandlers } from './parkingSpaces';
import { areasHandlers } from './areas';

export const handlers = [...parkingSpacesHandlers, ...areasHandlers];
