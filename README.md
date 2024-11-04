# EInvoice-EU

Tool-chain for generating EN16931 conforming invoices

## Status

This is work-in-progress and not yet ready to use!

## Description

This repository is an attempt to aid small businesses, especially in France and Germany but also in other parts of the European Union to create electronic invoices conforming with EN16931 with only free and open-source software.

It is quite unlikely that you can use anything here out of the box. See it as a starter template for your own solution.

## Pre-requisites

- NodeJS 20.x
- Bun (you can use npm, yarn, pnpm, ... instead if you prefer)

## Installation

```bash
$ bun install
```

This may warn about "husky" missing. Just run `bun install` again in order
to fix this.

## Running the app

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

## Test

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## Curl Examples

The following assumes that you run the application with `start:dev` and the
API is exposed at http://localhost:3000.

### OpenAPI/Swagger documentation

```bash
curl http://localhost:3000/api
```

It probably makes more sense to open that URL in the browser.

### Transform Data from Spreadsheet

The application ships with a mapping in `resources/default-invoice.yaml`.
You can use it with the spreadsheet data from
`contrib/templates/1234567890-consulting/default-invoice.ods` like this:

```bash
$ curl -X POST http://localhost:3000/api/mapping/transform/default-invoice \
	-F mapping=@contrib/mappings/default-invoice.yaml \
	-F data=@contrib/templates/1234567890-consulting/default-invoice.ods
```

### Create an Invoice from a Spreadsheet

```bash
$ curl -v -X POST \
    http://localhost:3000/api/invoice/transform-and-create/UBL \
    -F mapping=@contrib/mappings/default-invoice.yaml \
    -F data=@contrib/templates/1234567890-consulting/default-invoice.ods
```

This will transform the spreadsheet into the internal format and immediately
create an invoice in format `UBL`.

The format `UBL` is currently the only supported format.

## Frequently Asked Questions

### Why are no Numbers Used in the JSON Schema?

Amounts have to be numbers >= 0 with at most two decimal places. The following
JSON schema should work for this:

```json
{
	"type": "number",
	"multipleOf": 0.01
}
```

This is even documented in the [JSON Schema
documentation](https://json-schema.org/understanding-json-schema/reference/numeric#multiples).
Unfortunately, this does not work with the JavaScript implementation, see
https://github.com/ajv-validator/ajv/issues/652.

There are workarounds for this limitation of Ajv but I want to avoid people
naïvely validating against the schema with Ajv without applying the necessary
workaround. It looks simpler to require all amounts to be formatted
beforehand by the software that generates the input data.

The problem for percentages is the same only that percentages can have up
to four decimal digits.

For other numerical types, like quantities, we could use numbers but for
consistency we use strings throughout the schema.

## License

This is free software available under the terms of the
[WTFPL](http://www.wtfpl.net/).
