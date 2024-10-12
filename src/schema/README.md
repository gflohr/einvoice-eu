# EInvoice EU Schemas

This directory contains the required JSON schemas.

## `ubl-invoice.schema.json`

A JSON schema for UBL invoice documents.  It is generated from the Peppol
XML definitions.

All know formal constraints (read regular expressions/patterns) are included
but business rule checking is not part of the schema.

That has some surprising consequences. For example, the supplier postal
address is mandatory
(see https://docs.peppol.eu/poacc/billing/3.0/syntax/ubl-invoice/cac-AccountingCustomerParty/cac-Party/cac-PostalAddress/)
but has only one mandatory field `cac:Country`.
