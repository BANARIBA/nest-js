import { Test, TestingModule } from '@nestjs/testing';
import { MessagesWsService } from './messages-ws.service';

describe('MessagesWsService', () => {
  let service: MessagesWsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesWsService],
    }).compile();

    service = module.get<MessagesWsService>(MessagesWsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
