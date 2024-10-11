import * as yaml from 'js-yaml';
import * as fs from 'fs/promises';

interface JSONData {
	[key: string]: any;
}

if (process.argv.length !== 3) {
	console.error(`usage: ${process.argv[1]} SCHEMA-YAML`);
	process.exit(1);
}

parseSchema().then(() => process.exit(0));

async function parseSchema(): Promise<void> {
	const filename = process.argv[2];
	const content = await fs.readFile(filename, 'utf8');
	const data = yaml.load(content) as JSONData;
	const jsonSchema = filterSchema(data);
	console.log(JSON.stringify(jsonSchema, null, 4));
}

/**
 * Filter out all cii attributes and store path information for all nodes.
 * The function is not robust at all.  Know your input data!
 *
 * @param schema the augmented schema
 * @param path the current "path".
 * @returns the modified schema
 */
function filterSchema(schema: JSONData, path: Array<string> = []): JSONData {
	if (typeof schema === 'object') {
		if ('type' in schema || '$ref' in schema) {
			if (schema.type === 'object') {
				if (
					!('additionalProperties' in schema && !schema.additionalProperties)
				) {
					const formattedPath = path.join('.');
					throw new Error(
						`additionalProperties not false at path '${formattedPath}'.`,
					);
				}

				if (!('required' in schema)) {
					const formattedPath = path.join('.');
					throw new Error(`required not set at path '${formattedPath}'.`);
				}

				for (const property of Object.keys(schema.properties)) {
					const [, name] = property.split(':', 2);
					schema.properties[name] = schema.properties[property];
					delete schema.properties[property];
				}
			} else if (schema.type !== 'array') {
				if (!('cii' in schema)) {
					const formattedPath = path.join('.');
					throw new Error(`missing attribute 'cii' at '${formattedPath}'`);
				}
				delete schema.cii;
			}
		}

		if ('required' in schema) {
			for (let i = 0; i < schema.required.length; ++i) {
				schema.required[i] = schema.required[i].replace(/^[^\:]+\:/, '');
			}
		}

		for (const key of Object.keys(schema)) {
			if (key !== '$defs') {
				filterSchema(schema[key], [...path, key]);
			}
		}
	}

	return schema; // Return the filtered schema
}
