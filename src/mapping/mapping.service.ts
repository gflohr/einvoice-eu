import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as v from 'valibot';
import * as yaml from 'js-yaml';

const MappingSchema = v.object({
	meta: v.object({
		loopColumn: v.string('The loop column must be a string.'),
	}),
	mapping: v.object({
		id: v.string('The id location must be a string.'),
	}),
});

export type Mapping = v.InferOutput<typeof MappingSchema>;

@Injectable()
export class MappingService {
	private readonly logger = new Logger(MappingService.name);

	async loadMapping(id: string): Promise<Mapping | null> {
		const filename = path.join('resources', 'mappings', id + '.yaml');

		try {
			const content = await fs.readFile(filename, 'utf8');
			const data = yaml.load(content);

			return this.validateMapping(data);
		} catch (e) {
			this.logger.error(`error loading mapping '${filename}': ${e}`);

			return null;
		}
	}

	private validateMapping(data: unknown): Mapping {
		return v.parse(MappingSchema, data);
	}
}
