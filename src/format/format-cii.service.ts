import { Injectable } from '@nestjs/common';

import { FormatUBLService } from './format-ubl.service';
import { EInvoiceFormat } from './format.e-invoice-format.interface';
import { Invoice } from '../invoice/invoice.interface';

// This is what we are looking at while traversing the input tree:
type Node = { [key: string]: Node } | Node[] | string;
type ObjectNode = { [key: string]: Node };

// Flags for Factur-X usage.
type FXUsage =
	| 0x0
	| 0x1
	| 0x2
	| 0x3
	| 0x4
	| 0x5
	| 0x6
	| 0x7
	| 0x8
	| 0xa
	| 0xb
	| 0xc
	| 0xd
	| 0xe
	| 0xf
	| 0x10
	| 0x11
	| 0x12
	| 0x13
	| 0x4
	| 0x15
	| 0x16
	| 0x17
	| 0x18
	| 0x19
	| 0x1a
	| 0x1b
	| 0x1c
	| 0x1d
	| 0x1d
	| 0x1f;
const FX_NONE: FXUsage = 0x0; // Field not allowed for Factur-X.
const FX_MINIMUM: FXUsage = 0x1;
const FX_BASIC_WL: FXUsage = 0x2;
const FX_BASIC: FXUsage = 0x4;
const FX_EN16931: FXUsage = 0x8;
const FX_EXTENDED: FXUsage = 0x10;
const FX_ALL: FXUsage = (FX_MINIMUM |
	FX_BASIC_WL |
	FX_BASIC |
	FX_EN16931 |
	FX_EXTENDED) as FXUsage;
const FX_MIN_BASIC_WL: FXUsage = (FX_BASIC_WL |
	FX_BASIC |
	FX_EN16931 |
	FX_EXTENDED) as FXUsage;
const FX_MIN_EN16931: FXUsage = (FX_EN16931 |
	FX_BASIC_WL |
	FX_BASIC |
	FX_EN16931 |
	FX_EXTENDED) as FXUsage;
const FX_MIN_BASIC: FXUsage = (FX_BASIC | FX_EN16931 | FX_EXTENDED) as FXUsage;

type SubType = 'DateTimeString';

// Both `src` and `dest` contain an array of element names that defines the
// path to that node.
//
// For `src`, a special semantic exists.  If an element name begins with the
// special prefix "fixed:", everything after that prefix is returned.  In
// general, this should be the last element in the list so that it is only
// rendered if the elements it depends on exist in the source.
type Transformation =
	| {
			type: 'object' | 'array';
			subtype?: never;
			src: string[];
			dest: string[];
			children: Transformation[];
	  }
	| {
			type: 'string';
			subtype?: SubType;
			src: string[];
			dest: string[];
			children?: never;
			fxUsage: FXUsage;
	  };

const invoiceLine: Transformation = {
	type: 'array',
	src: ['cac:InvoiceLine'],
	dest: [
		'rsm:SupplyChainTradeTransaction',
		'ram:IncludedSupplyChainTradeLineItem',
	],
	children: [
		{
			type: 'string',
			src: ['cbc:ID'],
			dest: ['ram:AssociatedDocumentLineDocument', 'ram:LineID'],
			fxUsage: FX_MIN_BASIC,
		},
		{
			type: 'string',
			src: ['cii:ParentLineID'],
			dest: ['ram:AssociatedDocumentLineDocument', 'ram:ParentLineID'],
			fxUsage: FX_NONE,
		},
		{
			type: 'string',
			src: ['cii:LineStatusCode'],
			dest: ['ram:AssociatedDocumentLineDocument', 'ram:LineStatusCode'],
			fxUsage: FX_EXTENDED,
		},
		{
			type: 'string',
			src: ['cii:IncludedNoteContentCode'],
			dest: [
				'ram:AssociatedDocumentLineDocument',
				'ram:IncludedNote',
				'udt:ContentCode',
			],
			fxUsage: FX_EXTENDED,
		},
		{
			type: 'string',
			src: ['cbc:Note'],
			dest: [
				'ram:AssociatedDocumentLineDocument',
				'ram:IncludedNote',
				'ram:Content',
			],
			fxUsage: FX_MIN_BASIC_WL,
		},
		{
			type: 'string',
			src: ['cii:IncludedNoteSubjectCode'],
			dest: [
				'ram:AssociatedDocumentLineDocument',
				'ram:IncludedNote',
				'udt:SubjectCode',
			],
			fxUsage: FX_MIN_BASIC_WL,
		},
		{
			type: 'string',
			src: ['cac:Item', 'cii:SpecifiedTradeProductID'],
			dest: ['ram:SpecifiedTradeProduct', 'ram:ID'],
			fxUsage: FX_NONE,
		},
		{
			type: 'string',
			src: ['cac:Item', 'cac:StandardItemIdentification', 'cbc:ID'],
			dest: ['ram:SpecifiedTradeProduct', 'ram:GlobalID'],
			fxUsage: FX_MIN_BASIC,
		},
		{
			type: 'string',
			src: ['cac:Item', 'cac:StandardItemIdentification', 'cbc:ID@schemeID'],
			dest: ['ram:SpecifiedTradeProduct', 'ram:GlobalID@schemeID'],
			fxUsage: FX_MIN_BASIC,
		},
		{
			type: 'string',
			src: ['cac:Item', 'cac:SellersItemIdentification', 'cbc:ID'],
			dest: ['ram:SpecifiedTradeProduct', 'ram:SellerAssignedID'],
			fxUsage: FX_MIN_EN16931,
		},
		{
			type: 'string',
			src: ['cac:Item', 'cac:BuyersItemIdentification', 'cbc:ID'],
			dest: ['ram:SpecifiedTradeProduct', 'ram:BuyerAssignedID'],
			fxUsage: FX_MIN_EN16931,
		},
		{
			type: 'string',
			src: ['cac:Item', 'cbc:Name'],
			dest: ['ram:SpecifiedTradeProduct', 'ram:Name'],
			fxUsage: FX_MIN_BASIC,
		},
		{
			type: 'string',
			src: ['cac:Item', 'cbc:Description'],
			dest: ['ram:SpecifiedTradeProduct', 'ram:Description'],
			fxUsage: FX_MIN_EN16931,
		},
		{
			type: 'string',
			src: ['cac:Item', 'cac:AdditionalItemProperty', 'cii:TypeCode'],
			dest: [
				'ram:SpecifiedTradeProduct',
				'ram:ApplicableProductCharacteristic',
				'ram:TypeCode',
			],
			fxUsage: FX_EXTENDED,
		},
		{
			type: 'string',
			src: ['cac:Item', 'cac:AdditionalItemProperty', 'cbc:Name'],
			dest: [
				'ram:SpecifiedTradeProduct',
				'ram:ApplicableProductCharacteristic',
				'ram:Description',
			],
			fxUsage: FX_MIN_EN16931,
		},
		{
			type: 'string',
			src: ['cac:Item', 'cac:AdditionalItemProperty', 'cii:ValueMeasure'],
			dest: [
				'ram:SpecifiedTradeProduct',
				'ram:ApplicableProductCharacteristic',
				'ram:ValueMeasure',
			],
			fxUsage: FX_EXTENDED,
		},
		{
			type: 'string',
			src: [
				'cac:Item',
				'cac:AdditionalItemProperty',
				'cii:ValueMeasure@unitCode',
			],
			dest: [
				'ram:SpecifiedTradeProduct',
				'ram:ApplicableProductCharacteristic',
				'ram:ValueMeasure@unitCode',
			],
			fxUsage: FX_EXTENDED,
		},
		{
			type: 'string',
			src: ['cac:Item', 'cac:AdditionalItemProperty', 'cbc:Value'],
			dest: [
				'ram:SpecifiedTradeProduct',
				'ram:ApplicableProductCharacteristic',
				'ram:Value',
			],
			fxUsage: FX_MIN_EN16931,
		},
	],
};

const ubl2cii: Transformation = {
	type: 'object',
	src: ['ubl:Invoice'],
	dest: ['rsm:CrossIndustryInvoice'],
	children: [
		{
			type: 'string',
			src: ['cii:TestIndicator'],
			dest: [
				'rsm:ExchangedDocumentContext',
				'ram:TestIndicator',
				'udt:Indicator',
			],
			fxUsage: FX_EXTENDED,
		},
		{
			type: 'string',
			src: ['cbc:ProfileID'],
			dest: [
				'rsm:ExchangedDocumentContext',
				'ram:BusinessProcessSpecifiedDocumentContextParameter',
				'ram:ID',
			],
			fxUsage: FX_ALL,
		},
		{
			type: 'string',
			src: ['cbc:CustomizationID'],
			dest: [
				'rsm:ExchangedDocumentContext',
				'ram:GuidelineSpecifiedDocumentContextParameter',
				'ram:ID',
			],
			fxUsage: FX_ALL,
		},
		{
			type: 'string',
			src: ['cbc:ID'],
			dest: ['ram:ExchangedDocument', 'ram:ID'],
			fxUsage: FX_ALL,
		},
		{
			type: 'string',
			src: ['cii:Name'],
			dest: ['ram:ExchangedDocument', 'ram:Name'],
			fxUsage: FX_EXTENDED,
		},
		{
			type: 'string',
			subtype: 'DateTimeString',
			src: ['cbc:IssueDate'],
			dest: [
				'ram:ExchangedDocument',
				'ram:IssueDateTime',
				'udt:DateTimeString',
			],
			fxUsage: FX_ALL,
		},
		{
			type: 'string',
			src: ['cbc:IssueDate', 'fixed:102'],
			dest: [
				'ram:ExchangedDocument',
				'ram:IssueDateTime',
				'udt:DateTimeString@format',
			],
			fxUsage: FX_ALL,
		},
		{
			type: 'string',
			src: ['cii:CopyIndicator'],
			dest: ['ram:ExchangedDocument', 'ram:CopyIndicator', 'udt:Indicatory'],
			fxUsage: FX_EXTENDED,
		},
		{
			type: 'array',
			src: [],
			dest: [],
			children: [
				{
					type: 'string',
					src: ['cii:LanguageID'],
					dest: ['ram:ExchangedDocument', 'ram:LanguageID'],
					fxUsage: FX_EXTENDED,
				},
			],
		},
		{
			type: 'string',
			src: ['cii:IncludedNoteContentCode'],
			dest: ['ram:ExchangedDocument', 'ram:IncludedNote', 'udt:ContentCode'],
			fxUsage: FX_EXTENDED,
		},
		{
			type: 'string',
			src: ['cbc:Note'],
			dest: ['ram:ExchangedDocument', 'ram:IncludedNote', 'ram:Content'],
			fxUsage: FX_MIN_BASIC_WL,
		},
		{
			type: 'string',
			src: ['cii:IncludedNoteSubjectCode'],
			dest: ['ram:ExchangedDocument', 'ram:IncludedNote', 'udt:SubjectCode'],
			fxUsage: FX_MIN_BASIC_WL,
		},
		{
			type: 'string',
			subtype: 'DateTimeString',
			src: ['cii:EffectiveSpecifiedPeriod'],
			dest: [
				'ram:ExchangedDocument',
				'ram:EffectiveSpecifiedPeriod',
				'ram:CompleteDateTime',
				'udt:DateTimeString',
			],
			fxUsage: FX_EXTENDED,
		},
		{
			type: 'string',
			src: ['cii:EffectiveSpecifiedPeriod', 'fixed:102'],
			dest: [
				'ram:ExchangedDocument',
				'ram:EffectiveSpecifiedPeriod',
				'ram:CompleteDateTime',
				'udt:DateTimeString@format',
			],
			fxUsage: FX_ALL,
		},
		invoiceLine,
	],
};

@Injectable()
export class FormatCIIService
	extends FormatUBLService
	implements EInvoiceFormat
{
	get customizationID(): string {
		return 'urn:cen.eu:en16931:2017';
	}

	get profileID(): string {
		return 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0';
	}

	get syntax(): 'CII' {
		return 'CII';
	}

	generate(invoice: Invoice): string {
		const cii: Node = {};
		this.convert(invoice as unknown as ObjectNode, cii, [ubl2cii]);

		cii['rsm:CrossIndustryInvoice@xmlns:xsi'] =
			'http://www.w3.org/2001/XMLSchema-instance';
		cii['rsm:CrossIndustryInvoice@xsi:schemaLocation'] =
			'urn:un:unece:uncefact:data' +
			':standard:CrossIndustryInvoice:100' +
			' ../schema/D16B%20SCRDM%20(Subset)/uncoupled%20clm/CII/uncefact' +
			'/data/standard/CrossIndustryInvoice_100pD16B.xsd';
		cii['rsm:CrossIndustryInvoice@xmlns:qdt'] =
			'urn:un:unece:uncefact:data:standard:QualifiedDataType:100';
		cii['rsm:CrossIndustryInvoice@xmlns:udt'] =
			'urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100';
		cii['rsm:CrossIndustryInvoice@xmlns:rsm'] =
			'urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100';
		cii['rsm:CrossIndustryInvoice@xmlns:ram'] =
			'urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEn';

		return this.render(cii, {
			prettyPrint: true,
			indent: '\t',
		});
	}

	private convert(
		src: ObjectNode,
		dest: ObjectNode,
		transformations: Transformation[],
	) {
		for (const transformation of transformations) {
			const childSrc = this.resolveSrc(src, transformation.src);
			if (!childSrc) continue;
			const srcKey = transformation.src[transformation.src.length - 1];
			if (!(srcKey in childSrc)) continue;

			const childDest = this.resolveDest(dest, transformation.dest);
			const destKey = transformation.dest[transformation.dest.length - 1];

			switch (transformation.type) {
				case 'object':
					childDest[destKey] ??= {};
					this.convert(
						childSrc[srcKey] as ObjectNode,
						childDest[destKey] as ObjectNode,
						transformation.children,
					);
					break;
				case 'array':
					childDest[destKey] ??= [];
					const groups = src[srcKey] as Node[];
					for (const group of groups) {
						const node: Node = {};
						(childDest[destKey] as Node[]).push(node);
						this.convert(group as ObjectNode, node, transformation.children);
					}
					break;
				case 'string':
					if (srcKey in childSrc) {
						childDest[destKey] = this.renderValue(
							childSrc[srcKey] as string,
							transformation,
						);
					}
					break;
				default:
					break;
			}
		}
	}

	private renderValue(value: string, transformation: Transformation): string {
		if (transformation.subtype === 'DateTimeString') {
			return value.replaceAll('-', '');
		} else {
			return value;
		}
	}

	private resolveSrc(ptr: ObjectNode, keys: string[]): ObjectNode | undefined {
		if (keys.length) {
			for (let i = 0; i < keys.length - 1; ++i) {
				const key = keys[i];

				if (key in ptr) {
					ptr = ptr[key] as ObjectNode;
				} else {
					return undefined;
				}
			}

			if (keys[keys.length - 1].startsWith('fixed:')) {
				const key = keys[keys.length - 1];
				return { [key]: key.substring(6) };
			}
		}

		return ptr;
	}

	private resolveDest(ptr: ObjectNode, keys: string[]) {
		if (keys.length) {
			for (let i = 0; i < keys.length - 1; ++i) {
				const key = keys[i];
				if (key in ptr) {
					ptr = ptr[key] as ObjectNode;
				} else {
					ptr[key] = {};
					ptr = ptr[key];
				}
			}
		}

		return ptr;
	}
}