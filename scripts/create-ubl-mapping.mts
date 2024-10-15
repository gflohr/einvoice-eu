#! /usr/bin/env node

import * as fs from 'fs';
import yaml from 'js-yaml';

if (process.argv.length !== 4) {
	console.error(`Usage: ${process.argv[1]} INVOICE_SCHEMA MAPPING_SCHEMA`)
}

const invoiceSchemaFilename = process.argv[2];
//const mappingSchemaFilename = process.argv[3];

const invoiceSchemaYaml = fs.readFileSync(invoiceSchemaFilename, 'utf-8');
const invoiceSchema = yaml.load(invoiceSchemaYaml, { filename: invoiceSchemaFilename });

console.log(invoiceSchema);
