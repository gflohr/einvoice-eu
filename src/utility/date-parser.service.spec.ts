import { Test, TestingModule } from '@nestjs/testing';
import { DateParserService } from './date-parser.service';

describe('DateParserService', () => {
	let service: DateParserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DateParserService],
		}).compile();

		service = module.get<DateParserService>(DateParserService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should do something', () => {
		expect(service.parse('fi-FI', 'foobar')).toBeDefined();
	});
});
