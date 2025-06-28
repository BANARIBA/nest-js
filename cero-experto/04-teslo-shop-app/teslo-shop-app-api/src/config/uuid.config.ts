import {v4 as uuid} from 'uuid';

export const getUUID = (): string => {
  return uuid();
}