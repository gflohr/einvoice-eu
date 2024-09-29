import { Test, TestingModule } from '@nestjs/testing';
import { MappingService } from './mapping.service';
import * as fs from 'fs/promises';
import { Logger } from '@nestjs/common';

jest.mock('fs/promises');

describe('MappingService', () => {
	let service: MappingService;
	let loggerErrorSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MappingService],
		}).compile();

		service = module.get<MappingService>(MappingService);
		loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should load a mapping', async () => {
		const id = 'default';
		const wanted = 'mock yaml content';

		const readFileMock = fs.readFile as jest.MockedFunction<typeof fs.readFile>;
		readFileMock.mockResolvedValue(wanted);

		const got = await service.loadMapping(id);

		expect(got).toEqual(wanted);
		expect(readFileMock).toHaveBeenCalledWith(
			`resources/mappings/${id}.yaml`,
			'utf8',
		);
	});

	it('should return null and log an error if the mapping does not exist', async () => {
		const id = 'custom';
		const errorMessage = 'No such file or directory';

		const readFileMock = fs.readFile as jest.MockedFunction<typeof fs.readFile>;
		readFileMock.mockRejectedValue(new Error(errorMessage));

		const got = await service.loadMapping(id);

		expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
		expect(got).toBeNull();
	});
});
