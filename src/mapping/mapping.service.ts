import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import { InvoiceMapping } from './mapping.interface';

@Injectable()
export class MappingService {
	private readonly logger = new Logger(MappingService.name);

	async loadMapping(id: string): Promise<unknown> {
		const filename = path.join('resources', 'mappings', id + '.yaml');

		const content = await fs.readFile(filename, 'utf8');
		const data = yaml.load(content);

		return this.validateMapping(data);
	}

	validateMapping(data: unknown): InvoiceMapping {
		return data as InvoiceMapping;
	}
}
