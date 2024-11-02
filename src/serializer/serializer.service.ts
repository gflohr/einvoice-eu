import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { ExpandObject } from 'xmlbuilder2/lib/interfaces';

export type SerializerOptions = {
	indent?: string;
	prettyPrint?: boolean;
};

@Injectable()
export class SerializerService {
	xml(
		root: string,
		attributes: { [attr: string]: string },
		data: object,
		options: SerializerOptions = {},
	): string {
		const tree = {
			[root]: {} as { [prop: string]: any },
		};

		for (const attr in attributes) {
			tree[root][`@${attr}`] = attributes[attr];
		}

		Object.assign(tree[root], this.convert(data));

		const doc = create({ version: '1.0', encoding: 'utf-8' }).ele(tree);

		return doc.end({
			prettyPrint: options.prettyPrint,
			indent: options.indent,
		});
	}

	private convert(input: { [key: string]: any }): ExpandObject {
		const output: ExpandObject = {};
		if (Array.isArray(input)) {
		} else {
			for (const key in input) {
				if (typeof input[key] === 'object') {
					output[key] = this.convert(input[key]);
				} else {
					output[key] = input[key].toString();
				}
			}
		}

		return output;
	}
}
