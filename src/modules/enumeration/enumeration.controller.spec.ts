import { Test, TestingModule } from '@nestjs/testing';
import { EnumerationController } from './enumeration.controller';

describe('EnumerationController', () => {
  let controller: EnumerationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnumerationController],
    }).compile();

    controller = module.get<EnumerationController>(EnumerationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
