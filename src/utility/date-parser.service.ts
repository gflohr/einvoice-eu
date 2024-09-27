import { Injectable } from '@nestjs/common';

type LocaleData = {
	// National representation of the full weekday name.
	A: string[];

	// National representation of the abbreviated weekday name.
	a: string[];

	// National representation of the full month name.
	B: string[];

	// National representation of the abbreviated month name.
	b: string[];
};

const localeDataCache: { [locale: string]: LocaleData } = {};

@Injectable()
export class DateParserService {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	parse(locale: string, input: string): Date {
		this.getLocaleData(locale);
		console.log(`input: ${input}`);
		return new Date();
	}

	private getLocaleData(locale: string): LocaleData {
		if (!localeDataCache[locale]) {
			// The date 2024-01-07 is a Sunday, so the first day of the week is
			// Sunday here.
			const weekdays = Array.from(
				{ length: 7 },
				(_, i) => new Date(2024, 0, i + 7),
			);
			const months = Array.from({ length: 12 }, (_, i) => new Date(2024, i, 1));

			localeDataCache[locale] = {
				A: weekdays.map(month =>
					new Intl.DateTimeFormat(locale, { weekday: 'long' })
						.format(month)
						.toLocaleLowerCase(),
				),
				a: weekdays.map(month =>
					new Intl.DateTimeFormat(locale, { weekday: 'short' })
						.format(month)
						.toLocaleLowerCase(),
				),
				B: months.map(month =>
					new Intl.DateTimeFormat(locale, { month: 'long' })
						.format(month)
						.toLocaleLowerCase(),
				),
				b: months.map(month =>
					new Intl.DateTimeFormat(locale, { month: 'short' })
						.format(month)
						.toLocaleLowerCase(),
				),
			};
		}

		return localeDataCache[locale];
	}

	// FIXME! Make this private!
	extractInteger(input: string): { number: number; length: number } | null {
		let parsedNumber = '';
		let i = 0;

		while (i < input.length && /\d/.test(input[i])) {
			parsedNumber += input[i];
			i++;
		}

		const number = parseInt(parsedNumber, 10);
		if (Number.isNaN(number)) {
			return null;
		}

		return {
			number,
			length: parsedNumber.length,
		};
	}
}
