import * as yaml from 'js-yaml';
import * as fs from 'fs/promises';

if (process.argv.length !== 3) {
	console.error(`usage: ${process.argv[1]} SCHEMA-YAML`);
}

parseSchema().then(() => process.exit(0));

async function parseSchema(): Promise<void> {
	const filename = process.argv[2];
	const content = await fs.readFile(filename, 'utf8');
	const data = yaml.load(content);
	const jsonSchema = filterSchema(data);
	console.log(jsonSchema);
}

function filterSchema(schema: any, path: Array<string> = []): any {
	if (Array.isArray(schema)) {
		return schema.map(filterSchema);
	} else if (typeof schema === 'object' && schema !== null) {
		const newObj: any = {};

		for (const key in schema) {
			if (
				key === 'properties' &&
				typeof schema[key] === 'object' &&
				schema[key] !== null
			) {
				newObj[key] = {};
				for (const propKey in schema[key]) {
					const [ns, name] = propKey.split(':', 2);

					path.push(name);
					if (schema[key][propKey]['type'] === 'array') {
						path[path.length - 1] += '[]';
					}
					const fullPath = path.join('.');
					console.log(fullPath);
					newObj[key][name] = filterSchema(schema[key][propKey], path);
					path.pop();
				}
			} else {
				newObj[key] = filterSchema(schema[key], path);
			}
		}

		return newObj;
	} else {
		// If it's a primitive, return it directly.
		return schema;
	}
}
