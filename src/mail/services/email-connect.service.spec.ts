import { Test, TestingModule } from '@nestjs/testing';
import { EmailConnectService } from './email-connect.service';

describe('EmailConnectService', () => {
  let service: EmailConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailConnectService],
    }).compile();

    service = module.get<EmailConnectService>(EmailConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
