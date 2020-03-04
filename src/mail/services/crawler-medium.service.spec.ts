import { Test, TestingModule } from '@nestjs/testing';
import { CrawlerMediumService } from './crawler-medium.service';

describe('ScrapperService', () => {
  let service: CrawlerMediumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrawlerMediumService],
    }).compile();

    service = module.get<CrawlerMediumService>(CrawlerMediumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
