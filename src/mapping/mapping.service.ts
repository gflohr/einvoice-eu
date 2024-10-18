import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import { Mapping, MappingMetaInformation } from './mapping.interface';
import Ajv2019, { JSONSchemaType, ValidateFunction } from 'ajv/dist/2019';
import { mappingSchema } from './mapping.schema';
import { ValidationService } from '../validation/validation.service';
import { Invoice } from '../invoice/invoice.interface';
import * as XLSX from '@e965/xlsx';
import * as jsonpath from 'jsonpath-plus';
import { invoiceSchema } from '../invoice/invoice.schema';

// If you change anything here, you must also change the corresponding stuff
// in scripts/tranform-ubl-mapping.mts!
const ws = ' \\t\\n\\r\\f\\v';
// A tab name must not begin or end with a single quote and must not contain
// any of the characters "[]*?:/\\".
const tabNameForbiddenChars = '[\\]*?:/\\\\';
// When referencing an unquoted tab, the name must not contain quotes, spaces, or dots.
const tabRefNameForbiddenChars = `'${ws}\\.${tabNameForbiddenChars}`;
const tabRefUnquoted = `[^${tabRefNameForbiddenChars}]+`;
const tabRefQuoted = `'[^${tabNameForbiddenChars}]+'`;
const tabRef = `(?:${tabRefUnquoted}|${tabRefQuoted})`;
const columnName = '[A-Z]+';
const rowName = '[1-9][0-9]*';
const cellName = `${columnName}${rowName}`;

// A section reference is anything enclosed in square brackets.
const sectionRef = '\\[[^\\]]+\\]';

// A cell reference starts with an optional tab reference with a trailing dot,
// followed by a cell name, optionally followed by a section reference.
const cellRef = new RegExp(`(${tabRef}\\.)?(${cellName})(${sectionRef})?`);

@Injectable()
export class MappingService {
	private readonly logger = new Logger(MappingService.name);
	private readonly validator: ValidateFunction<Mapping>;
	private readonly basePath = path.join('resources', 'mappings');

	constructor(private readonly validationService: ValidationService) {
		const ajv = new Ajv2019({ strict: true, allErrors: true });
		this.validator = ajv.compile(mappingSchema);
	}

	async list(): Promise<Array<string>> {
		const dirEntries = await fs.readdir(this.basePath, { withFileTypes: true });

		const ids: Array<string> = [];
		for (const entry of dirEntries) {
			const name = entry.name;

			const id = name.replace(/\.ya?ml$/, '');
			if (name === id) {
				continue;
			}

			try {
				await this.loadMapping(id);
				ids.push(id);
			} catch (e) {
				this.logger.error(`invalid mapping '${this.basePath}/${name}': ${e}`);
			}
		}

		return ids;
	}

	async loadMapping(id: string): Promise<Mapping> {
		let filename = path.join(this.basePath, id + '.yaml');
		let content: string;

		try {
			content = await fs.readFile(filename, 'utf-8');
		} catch (e) {
			if (e.code && e.code === 'ENOENT') {
				filename = path.join(this.basePath, id + '.yml');
				content = await fs.readFile(filename, 'utf-8');
			} else {
				throw new Error(e);
			}
		}

		const data = yaml.load(content);

		const valid = this.validationService.validate(
			`mapping '${id}'`,
			this.validator,
			data,
		);

		return valid;
	}

	async transform(mappingId: string, file: Express.Multer.File): Promise<Invoice> {
		const mapping = await this.loadMapping(mappingId);
		const workbook = XLSX.read(file.buffer, { type: 'buffer', cellDates: true });
		const invoice: { [key: string]: any } = {
			'ubl:Invoice': {},
		};
		this.transformObject(invoice['ubl:Invoice'], mapping.meta, mapping['ubl:Invoice'], workbook, ['ubl:Invoice'], ['properties', 'ubl:Invoice']);

		return invoice as unknown as Invoice;
	}

	private transformObject(
		output: { [key: string]: any },
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		meta: MappingMetaInformation,
		obj: { [key: string]: any },
		workbook: XLSX.WorkBook,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		path: Array<string>,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		schemaPath: Array<string>,
	): any {
		for (const property in obj) {
			if (typeof obj[property] === 'string') {
				path.push(property);
				schemaPath.push('properties', property);
				//const schema = this.getSchema(schemaPath);
				output[property] = this.resolveValue(obj[property], workbook);
				schemaPath.pop();
				schemaPath.pop();
				path.pop();
			}
		}
	}

	private resolveValue(ref: string, workbook: XLSX.WorkBook): string {
		if (ref[0] === ':') {
			return ref.substring(1);
		}

		const matches = ref.match(cellRef) as RegExpMatchArray;
		const sheetName = matches[1] ?? workbook.SheetNames[0];
		const cellName = matches[2];
		//const section = matches[3];
		const worksheet = workbook.Sheets[sheetName];

		const value = this.getCellValue(worksheet, cellName);
		if (value === null) {
			return `Invalid reference ${ref} ${cellName}!`;
		}

		return value;
	}

	private getCellValue(worksheet: XLSX.WorkSheet, cellName: string): string | null {
		if (!(cellName in worksheet)) {
			return null;
		}

		const cell = worksheet[cellName];
		//console.warn(JSON.stringify(cell, null, 2));
		switch(cell.t) {
			case 'd':
				return this.getDateValue(cell.v as Date);
			default:
				return cell.v;
		}
	}

	private getDateValue(value: Date): string {
		return value.toISOString().substring(0, 10);
	}

	private getSchema(path: string[]): JSONSchemaType<any> {
		const jsonPath = ['$', ...path].join('.');
		console.warn(`path: ${jsonPath}`);

		return jsonpath.JSONPath({ path: jsonPath, json: invoiceSchema }) as JSONSchemaType<any>;
	}
}
