import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as v from 'valibot';
import * as yaml from 'js-yaml';

const LocationSchema = v.pipe(
	v.string('A location must be a string'),
	v.regex(/^([^'][^[\]*?:/\\]+[^']|\/.+)$/),
	v.description(
		'A location must be a valid LibreOffice sheet name followed by a dot' +
			' and a cell name or a literal value starting with a slash.',
	),
);

const MappingSchema = v.object({
	meta: v.object({
		loopColumn: v.string('The loop column must be a string.'),
	}),
	mapping: v.object({
		id: LocationSchema,
	}),
});

export type Mapping = v.InferOutput<typeof MappingSchema>;

@Injectable()
export class MappingService {
	private readonly logger = new Logger(MappingService.name);

	async loadMapping(id: string): Promise<Mapping> {
		const filename = path.join('resources', 'mappings', id + '.yaml');

		const content = await fs.readFile(filename, 'utf8');
		const data = yaml.load(content);

		return this.validateMapping(data);
	}

	private validateMapping(data: unknown): Mapping {
		return v.parse(MappingSchema, data);
	}
}
