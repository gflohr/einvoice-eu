#! /usr/bin/env node

import { got } from 'got';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const url = 'https://docs.peppol.eu/poacc/billing/3.0/syntax/ubl-invoice/tree/';

getHTML().then(html => {
	const elementSpecs = getRows(html);
	const tree = buildTree(elementSpecs);
	if (tree.length !== 1) throw new Error('huh?');
	const schema = buildSchema(tree[0]);
	console.log(yaml.dump(schema));
});

function parseCardinality(cardinality) {
	const [min, max] = cardinality.split('..').map(c => (c === 'n' ? Infinity : parseInt(c, 10)));
	return { min, max };
}

function processNode(node) {
	const { elementName, cardinality, children } = node;
	const { min, max } = parseCardinality(cardinality);
	let schema = { type: 'string' };

	// If the node has children, it's an object with properties
	if (children && children.length > 0) {
		const properties = {};
		const required = [];

		children.forEach(child => {
			properties[child.elementName] = processNode(child);
			if (parseCardinality(child.cardinality).min === 1) {
				required.push(child.elementName);
			}
		});

		schema = {
			type: 'object',
			properties,
			...(required.length > 0 && { required })
		};
	}

	// If it's an array (max > 1 or max is infinite), modify the schema accordingly
	if (max > 1 || max === Infinity) {
		schema = {
			type: 'array',
			items: schema,
			minItems: min,
			...(max !== Infinity ? { maxItems: max } : {})
		};
	}

	return schema;
}

function buildSchema(root) {
	const result = {
		type: 'object',
		properties: {},
		required: []
	};

	result.properties[root.elementName] = processNode(root);

	if (parseCardinality(root.cardinality).min === 1) {
		result.required.push(root.elementName);
	}

	return result;
}

function buildTree(items) {
	const root = [];
	const stack = [];

	for (const item of items) {
		while (stack.length && stack[stack.length - 1].depth >= item.depth) {
			stack.pop();
		}

		if (stack.length === 0) {
			root.push(item);
		} else {
			const parent = stack[stack.length - 1];
			if (!parent.children) {
				parent.children = [];
			}
			parent.children.push(item);
		}

		stack.push(item);
	}

	return root;
}

function getHTML() {
	return new Promise(resolve => {
		try {
			return resolve(
				fs.readFileSync('ubl-invoice.html', {
					encoding: 'utf-8',
				}),
			);
		} catch {
			got(url).then(response => response.body);
		}
	});
}

function getRows(html) {
	const rows = [];

	const dom = new JSDOM(html);

	const trs = dom.window.document.querySelectorAll(
		'div.table-responsive table.table-striped tbody tr',
	);
	for (let i = 0; i < trs.length; ++i) {
		const tds = trs[i].querySelectorAll('td');
		let cardinality = tds[0].querySelector('span').textContent;
		const elementInfo = tds[1].textContent.trim();
		const tokens = elementInfo.split(/[ \t\n]+/);
		let elementName = tokens.pop();
		let depth = tokens.filter(item => item === '•').length;
		// Promote attributes.
		if (elementName[0] === '@') {
			elementName = rows[rows.length - 1].elementName.replace(/.*@/, '') + elementName;
			if (cardinality === 'M') {
				cardinality = '1..1';
			} else if (cardinality === 'O') {
				cardinality = '0..1';
			}
			--depth;
		}
		rows.push({ cardinality, depth, elementName });
	}

	return rows;
}
