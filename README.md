# EInvoice-EU

Tool-chain for generating EN16931 conforming invoices

## Description

This repository is an attemt to aid small businesses, especially in France and Germany but also in other parts of the European Union to create electronic invoices conforming with EN16931 with only free and open-source software.

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
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

This is free software available under the terms of the
[WTFPL](http://www.wtfpl.net/).
