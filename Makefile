default: all

NPX = npx

INVOICE_SCHEMA_DEPENDENCIES = \
	peppol-bis-invoice-3/structure/syntax/ubl-invoice.xml \
	peppol-bis-invoice-3/structure/codelist/*.xml

all: \
	src/schema/ubl-invoice.schema.json \
	src/invoice/invoice.interface.ts \
	src/schema/ubl-mapping.schema.json

src/schema/ubl-invoice.schema.json: scripts/parse-ubl-structure.mts $(INVOICE_SCHEMA_DEPENDENCIES)
	$(NPX) tsx $< >$@ || rm -f $@
	$(NPX) ajv compile --spec=draft2019 -s $@ || rm -f $@

src/invoice/invoice.interface.ts: scripts/json-schema-to-typescript.mts src/schema/ubl-invoice.schema.json
	$(NPX) tsx $< src/schema/ubl-invoice.schema.json $@

src/schema/ubl-mapping.schema.json: scripts/transform-ubl-mapping.mts src/schema/ubl-invoice.schema.json
	$(NPX) tsx $< src/schema/ubl-invoice.schema.json $@
	$(NPX) ajv compile --spec=draft2019 -s $@ || rm -f $@

.PHONY: clean

clean:
	rm -f src/schema/*.json
