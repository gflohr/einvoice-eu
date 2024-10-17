import { Test, TestingModule } from '@nestjs/testing';
import { MappingController } from './mapping.controller';

describe('MappingController', () => {
  let controller: MappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MappingController],
    }).compile();

    controller = module.get<MappingController>(MappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
