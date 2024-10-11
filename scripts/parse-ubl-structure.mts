#! /usr/bin/env node

import * as fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

type Element = {
	Term: string;
	Name?: string;
	Description?: string;
	DataType?: string;
	Element?: Array<Element>;
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
		console.log(JSON.stringify(element.Element, null, '\t'));
		const tree = buildTree(element.Element);
		console.log(JSON.stringify(tree, null, 2));
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
			} else if ('Element' in node) {
				tree.Element ??= [];
				tree.Element.push(buildTree(node.Element));
			}
		}
	}

	return tree;
}

function buildSchema(root: any) {
	const result = {
		type: 'object',
		properties: {},
		required: [],
	};

	//result.properties[root.elementName] = processNode(root);

	//if (parseCardinality(root.cardinality).min === 1) {
	//	result.required.push(root.elementName);
	//}

	return result;
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
				child.Element = readXml(parser, `${basedir}/${filename}`);
				delete child.Include;
			}

			resolveStructure(parser, data[key]);
		}
	}

	return data;
}
