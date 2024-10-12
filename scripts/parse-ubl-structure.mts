#! /usr/bin/env node

import * as fs from 'fs';
import { XMLParser } from 'fast-xml-parser';
import { JSONSchemaType } from 'ajv';

// Data types:
// - Amount: number >= zero, max. 2 decimal digits.
// - Binary object: Base64 string
// - Code
// - Date
// - Document Reference
// - Identifier
// - Percentage
// - Quantity
// - Text

type Cardinality = {
	min: number;
	max: number;
};

type Element = {
	Term: string;
	Name?: string;
	Description?: string;
	DataType?: string;
	CodeList?: string;
	children?: Array<Element>;
	cardinality?: string;
};

const parser = new XMLParser({
	ignoreAttributes: false,
	preserveOrder: true,
	alwaysCreateTextNode: false,
});

const rootFilename = 'peppol-bis-invoice-3/structure/syntax/ubl-invoice.xml';
const basedir = rootFilename.substring(0, rootFilename.lastIndexOf('/'));
const structure = readXml(parser, rootFilename)[0].Structure;
for (const element of structure) {
	if ('Document' in element) {
		element.Element = element.Document;
		delete element.Document;
		const tree = buildTree(element.Element);
		console.log(JSON.stringify(buildSchema(tree), null, '\t'));
		process.exit(0);
	}
}

throw new Error(`error parsing '${rootFilename}'`);

function buildTree(element: any): Element {
	const tree:Element = {} as Element;

	for (const node of element) {
		if (typeof node === 'object') {
			if ('Term' in node) {
				tree.Term = node.Term[0]['#text'];
			} else if ('Name' in node) {
				tree.Name = node.Name[0]['#text'];
			} else if ('Description' in node) {
				tree.Description = node.Description[0]['#text'];
			} else if ('DataType' in node) {
				tree.DataType = node.DataType[0]['#text'];
			} else if ('Reference' in node && ':@' in node && 'CODE_LIST' == node[':@']['@_type']) {
				tree.CodeList = node.Reference[0]['#text'];
			} else if ('Attribute' in node) {
				const attribute = buildTree(node.Attribute);
				attribute.Term = `${tree.Term}@${attribute.Term}`;
				tree.children ??= [];
				tree.children.push(attribute);
				if (':@' in node && '@_usage' in node[':@'] && node[':@']['@_usage'] === 'Optional') {
					attribute.cardinality = '0..1';
				}
			} else if ('Element' in node) {
				tree.children ??= [];
				const newElement = buildTree(node.Element);
				tree.children.push(newElement);
				if (':@' in node && '@_cardinality' in node[':@']) {
					newElement.cardinality = node[':@']['@_cardinality'];
				}
			}
		}
	}

	return tree;
}

function buildSchema(tree: Element): JSONSchemaType<object> {
	const result = {
		type: 'object',
		properties: {},
		required: [],
	};

	(result.properties as { [key: string]: any})[tree.Term] = processNode(tree);

	if (parseCardinality(tree.cardinality).min === 1) {
		(result.required as unknown as string[]).push(tree.Term);
	}

	return result as JSONSchemaType<object>;
}

function processNode(node: Element): JSONSchemaType<object> {
	const { cardinality, children } = node;
	const { min, max } = parseCardinality(cardinality);
	const common: { [key: string]: string } = {};

	if ('Name' in node) {
		common.title = node.Name as string;
	}
	if ('Description' in node) {
		common.description = node.Description as string;
	}

	let schema: JSONSchemaType<any> = { type: 'string', ...common };

	// If the node has children, it's an object with properties
	if (children && children.length > 0) {
		const properties: { [key: string]: JSONSchemaType<object> } = {};
		const required: Array<string> = [];

		children.forEach(child => {
			properties[child.Term] = processNode(child);
			if (parseCardinality(child.cardinality).min === 1) {
				required.push(child.Term);
			}
		});

		schema = {
			type: 'object',
			...common,
			properties,
			...(required.length > 0 && { required }),
		} as JSONSchemaType<any>;
	}

	// If it's an array (max > 1 or max is infinite), modify the schema
	// accordingly.
	if (max > 1 || max === Infinity) {
		schema = {
			type: 'array',
			items: schema,
		};
		if (min > 0) {
			schema.minItems = min;
		}
		if (max !== Infinity) {
			schema.maxItems = max;
		}
	}

	return schema as JSONSchemaType<object>;
}

function readXml(parser: XMLParser, filename: string): any {
	const xml = fs.readFileSync(filename);
	const document = parser.parse(xml);
	if (typeof document[0] === 'object' && '?xml' in document[0]) {
		document.shift();
	}
	const data = resolveStructure(parser, document);

	return data;
}

function resolveStructure(parser: XMLParser, data: any): any {
	if (typeof data === 'object') {
		for (const key in data) {
			const child = data[key];
			if (Array.isArray(data) && typeof child === 'object' && 'Include' in child) {
				const filename = child.Include[0]['#text'];
				child.Element = readXml(parser, `${basedir}/${filename}`)[0].Element;
				delete child.Include;
			}

			resolveStructure(parser, data[key]);
		}
	}

	return data;
}

function parseCardinality(cardinality: string | undefined): Cardinality {
	if (typeof cardinality === 'undefined') return { min: 1, max: 1 };

	const [min, max] = cardinality
		.split('..')
		.map(c => (c === 'n' ? Infinity : parseInt(c, 10)));

	return { min, max };
}
