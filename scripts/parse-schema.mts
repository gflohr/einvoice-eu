import * as yaml from 'js-yaml';
import * as fs from 'fs/promises';

interface JSONData {
	[key: string]: any;
}

if (process.argv.length !== 3) {
	console.error(`usage: ${process.argv[1]} SCHEMA-YAML`);
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
		if ('type' in schema) {
			if (schema.type === 'object') {
				for (const property of Object.keys(schema.properties)) {
					const [ns, name] = property.split(':', 2);
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

		for (const key of Object.keys(schema)) {
			filterSchema(schema[key], [...path, key]);
		}
	}

	return schema; // Return the filtered schema
}
