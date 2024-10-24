import { Test, TestingModule } from '@nestjs/testing';
import { MappingService } from './mapping.service';
import * as fs from 'fs/promises';
import { ValidationService } from '../validation/validation.service';
import { JSONSchemaType } from 'ajv';
import * as XLSX from '@e965/xlsx';
import { Mapping } from './mapping.interface';
import { Invoice } from '../invoice/invoice.interface';

jest.mock('fs/promises');

// Used for testing `transform()`.
const mapping = {
	meta: {
		sectionColumn: {
			Invoice: 'S',
		},
	},
	'ubl:Invoice': {
		'cbc:CustomizationID': '=B1',
		'cbc:ID': '1234567890',
		'cbc:IssueDate': '=A1',
	},
} as unknown as Mapping;
const workbook = {
	SheetNames: ['Invoice'],
	Sheets: {
		Invoice: {
			A1: {
				t: 's',
				v: '2024-10-21',
			},
			B1: {
				t: 's',
				v: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
			},
		},
	},
} as XLSX.WorkBook;

describe('MappingService', () => {
	let service: MappingService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MappingService,
				ValidationService,
				{
					provide: 'ValidationService',
					useValue: {
						validate: jest.fn(),
					},
				},
			],
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

		const validateMock = jest
			.spyOn(ValidationService.prototype, 'validate')
			.mockImplementation((id, validatorFunction, data) => data);

		const wanted = { meta: 'something' };

		const got = await service.loadMapping(id);

		expect(got).toEqual(wanted);
		expect(readFileMock).toHaveBeenCalledWith(
			`resources/mappings/${id}.yaml`,
			'utf-8',
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

	it('should throw an exception if a non-existing sheet is referenced', () => {
		const wb: XLSX.WorkBook = {
			Sheets: {},
		} as XLSX.WorkBook;
		try {
			service['resolveValue'](
				'=Inwoice.A1',
				wb,
				{
					$ref: '#/defs/testCase/typo',
				} as JSONSchemaType<any>,
				['ubl:Invoice', 'cbc:ID'],
			);
			throw new Error('no exception thrown');
		} catch (e) {
			expect(e).toBeDefined();
			expect(e.validation).toBeTruthy();
			expect(e.ajv).toBeTruthy();
			expect(Array.isArray(e.errors)).toBeTruthy();
			expect(e.errors.length).toBe(1);

			const error = e.errors[0];
			expect(error.instancePath).toBe('/ubl:Invoice/cbc:ID');
			expect(error.schemaPath).toBe('#/ubl%3AInvoice/cbc%3AID');
			expect(error.keyword).toBe('EN16931/#/defs/testCase/typo');
			expect(error.params).toEqual({});
			expect(error.message).toBe(
				"reference '=Inwoice.A1': no such sheet 'Inwoice'",
			);
		}
	});

	describe('should transform invoice data', () => {
		let invoice: Invoice;

		beforeAll(async () => {
			const mockLoadMapping = jest
				.spyOn(service, 'loadMapping')
				.mockResolvedValueOnce(mapping);
			const buf: Buffer = [] as unknown as Buffer;

			jest.spyOn(XLSX, 'read').mockReturnValueOnce(workbook);

			invoice = await service.transform('test-id', buf);

			mockLoadMapping.mockRestore();
		});

		it('should return an invoice object', () => {
			expect(invoice).toBeDefined();
			expect(invoice['ubl:Invoice']).toBeDefined();
		});

		it('should map a literal value', () => {
			expect(invoice['ubl:Invoice']['cbc:ID']).toBe('1234567890');
		});

		it('should map a literal date', () => {
			expect(invoice['ubl:Invoice']['cbc:IssueDate']).toBe('2024-10-21');
		});

		it('should map a string value', () => {
			const wanted = workbook.Sheets.Invoice.B1.v;
			expect(invoice['ubl:Invoice']['cbc:CustomizationID']).toBe(wanted);
		});
	});

	it('should resolve a subschema', () => {
		const path = [
			'properties',
			'ubl:Invoice',
			'properties',
			'cac:InvoiceLine',
			'items',
			'properties',
			'cac:InvoicePeriod',
		];
		const got = service['getSchema'](path);

		expect(got).toBeDefined();
		expect(got.type).toBe('object');
		expect(got.title).toBe('INVOICE LINE PERIOD');
	});

	describe('getting cell values', () => {
		const worksheet: XLSX.WorkSheet = {
			A1: {
				t: 'd',
				v: new Date('2024-10-21T12:23:45.789Z'),
			},
			B1: {
				v: '2024-11-22',
			},
		};

		it('should get date values', () => {
			expect(
				service['getCellValue'](worksheet, 'A1', {
					$ref: '#/$defs/dataTypes/Date',
				} as JSONSchemaType<any>),
			).toMatch(/^2024-10-/);
		});

		it('should get bare date values', () => {
			expect(
				service['getCellValue'](worksheet, 'B1', {
					$ref: '#/$defs/dataTypes/Date',
				} as JSONSchemaType<any>),
			).toBe('2024-11-22');
		});
	});
});
