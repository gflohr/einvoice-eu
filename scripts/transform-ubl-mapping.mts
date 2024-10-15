#! /usr/bin/env node

import { JSONSchemaType } from 'ajv';
import * as fs from 'fs';
import yaml from 'js-yaml';
import { Invoice } from '../src/invoice/invoice.interface';

if (process.argv.length !== 4) {
	console.error(`Usage: ${process.argv[1]} INVOICE_SCHEMA MAPPING_SCHEMA`)
}

const invoiceSchemaFilename = process.argv[2];
const mappingSchemaFilename = process.argv[3];

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

/*
 * Regular expressions for various things.
 */

const ws = ' \\t\\n\\r\\f\\v';
// A tabname must not begin or end with a single-quote and not contain any of
// the characters "[]*?:/\".
const tabNameForbiddenChars = '[\\]*?:/\\\\';
// When referencing an unquoted tab, the name must not contain quotes, spaces or
// dots.
const tabRefNameForbiddenChars = `'${ws}\\.${tabNameForbiddenChars}`;
const tabRefUnquoted = `[^${tabRefNameForbiddenChars}]+`;
const tabRefQuoted = `'[^${tabNameForbiddenChars}]+'`;
const tabRef = `${tabRefUnquoted}|${tabRefQuoted}`;
const columnName = '[A-Z]+';
const rowName = '[1-9][0-9]*';
const cellName = `^${columnName}${rowName}$`;
// A section reference is anything enclosed in square brackets.
const sectionRef = '\[[^[\]]+\]';
// A cell reference starts with an optional tab reference with a trailing dot,
// followed by a cell cell name, optionally followed by a section reference.
const cellRef = `(?:${tabRef}\.)?${cellName}(?:${sectionRef})?$`;
const literal = '\*.+';
const valueRef = `^${cellRef}|${literal}$`;
new RegExp(valueRef);

const invoiceSchemaYaml = fs.readFileSync(invoiceSchemaFilename, 'utf-8');
const invoiceSchema = yaml.load(invoiceSchemaYaml, { filename: invoiceSchemaFilename }) as JSONSchemaType<Invoice>;
transformSchema(invoiceSchema);

const mappingSchema: JSONSchemaType<object> = {
	$schema: 'https://json-schema.org/draft/2019-09/schema',
	$id: `https://www.cantanea.com/schemas/ubl-invoice-schema-v${pkg.version}`,
	type: 'object',
	title: 'Invoice Mapping',
	description: 'Maps invoice data to the cells in a spreadsheet.',
	properties: {
		meta: {
			type: 'object',
			additionalProperties: false,
			title: 'Mapping Meta Information',
			description: 'Auxiliary information for the mapping data.',
			properties: {
				sectionColumn: {
					type: 'object',
					additionalProperties: false,
					patternProperties: {
						'^[^\'[\]*?:/\\][^[\]*?:/\\]*[^\'[\]*?:/\\]$': {
							type: 'string',
							title: 'Column name for the section markers.',
							description: 'This column marks the individual sections.',
							pattern: `${columnName}`,
						}
					}
				},
			},
			required: ['sectionColumn'],
		},
		ublInvoice: invoiceSchema.properties.ublInvoice,
	},
	required: ['meta', 'ublInvoice'],
	'$defs': {
		'valueRef': {
			type: 'string',
			pattern: valueRef,
		},
	}
};

fs.writeFileSync(mappingSchemaFilename, JSON.stringify(mappingSchema, null, '\t'));

function transformSchema(schema: JSONSchemaType<any>): void {
	// Transform properties if they exist
	if (schema.properties) {
		const newProperties: Record<string, any> = {};

		for (const [key, value] of Object.entries(schema.properties)) {
			// Remove the first colon (if present) from property names
			const newKey = key.replace(/:/, '');

			// Recursively transform nested schemas
			transformSchema(value as JSONSchemaType<any>);

			const valueObject = value as Record<string, any>;
			// Update type and references
			if (valueObject.type === 'string' || valueObject.$ref) {
				newProperties[newKey] = { $ref: '#/$defs/valueRef' };
			} else if (valueObject.type === 'array') {
				// Convert array to object
				const newObject: Record<string, JSONSchemaType<any>> = {};
				if (valueObject.items) {
					newObject['items'] = valueObject.items;
				}
				newProperties[newKey] = { type: 'object', properties: newObject };
			} else {
				// Preserve other types
				newProperties[newKey] = value;
			}
		}

		schema.properties = newProperties;

		// Update required array to reflect changes in property names
		if (schema.required) {
			schema.required = schema.required.map((name: string) =>
				name.replace(/:/, '')
			);
		}
	}
}
