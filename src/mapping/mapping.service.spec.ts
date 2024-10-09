import { Test, TestingModule } from '@nestjs/testing';
import { MappingService } from './mapping.service';
import * as fs from 'fs/promises';

jest.mock('fs/promises');

describe('MappingService', () => {
	let service: MappingService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MappingService],
		}).compile();

		service = module.get<MappingService>(MappingService);

		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should load a mapping', async () => {
		const id = 'default';
		const yaml = 'meta: something';

		const readFileMock = fs.readFile as jest.MockedFunction<typeof fs.readFile>;
		readFileMock.mockResolvedValue(yaml);

		const wanted = { meta: 'something' };
		const validateMock = jest
			.spyOn(service as any, 'validateMapping')
			.mockReturnValue(wanted);

		const got = await service.loadMapping(id);

		expect(got).toEqual(wanted);
		expect(readFileMock).toHaveBeenCalledWith(
			`resources/mappings/${id}.yaml`,
			'utf8',
		);
		expect(validateMock).toHaveBeenCalledTimes(1);
	});

	it('should throw an exception if the mapping does not exist', async () => {
		const id = 'custom';
		const errorMessage = 'No such file or directory';

		const readFileMock = fs.readFile as jest.MockedFunction<typeof fs.readFile>;
		readFileMock.mockRejectedValue(new Error(errorMessage));

		await expect(service.loadMapping(id)).rejects.toThrow(errorMessage);

		expect(readFileMock).toHaveBeenCalledTimes(1);
	});

	it('should throw an error if the mapping is invalid', async () => {
		const id = 'default';
		const yaml = 'meta: something';
		const errorMessage = new RegExp('^Invalid type');

		const readFileMock = fs.readFile as jest.MockedFunction<typeof fs.readFile>;
		readFileMock.mockResolvedValue(yaml);

		await expect(service.loadMapping(id)).rejects.toThrow(errorMessage);
	});
});
