import { Test, TestingModule } from '@nestjs/testing';
import { MappingController } from './mapping.controller';
import { MappingService } from './mapping.service';

describe('MappingController', () => {
	let controller: MappingController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MappingController],
			providers: [
				{
					provide: MappingService,
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<MappingController>(MappingController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
