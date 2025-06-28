import { Test, TestingModule } from '@nestjs/testing';
import { MessagesWsGateway } from './messages-ws.gateway';
import { MessagesWsService } from './messages-ws.service';

describe('MessagesWsGateway', () => {
  let gateway: MessagesWsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesWsGateway, MessagesWsService],
    }).compile();

    gateway = module.get<MessagesWsGateway>(MessagesWsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
