import { v4 as uuid } from 'uuid';

export class UUIDConfig {
  public static get uuid(): string {
    return uuid();
  }
}
