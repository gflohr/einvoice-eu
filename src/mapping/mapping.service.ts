import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

export type Mapping = {
	meta: Record<string, any>;
	mapping: Record<string, any>;
};

@Injectable()
export class MappingService {
	private readonly logger = new Logger(MappingService.name);

	async loadMapping(id: string): Promise<string | null> {
		const filename = path.join('resources', 'mappings', id + '.yaml');

		try {
			const content = await fs.readFile(filename, 'utf8');

			return content;
		} catch (e) {
			this.logger.error(`error loading mapping '${filename}': ${e}`);

			return null;
		}
	}
}
