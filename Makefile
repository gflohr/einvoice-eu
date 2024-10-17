default: all

NPX = npx

INVOICE_SCHEMA_DEPENDENCIES = \
	peppol-bis-invoice-3/structure/syntax/ubl-invoice.xml \
	peppol-bis-invoice-3/structure/codelist/*.xml

all: \
	src/schema/invoice.schema.json \
	src/invoice/invoice.interface.ts \
	src/schema/mapping.schema.json \
	src/mapping/mapping.interface.ts

src/schema/invoice.schema.json: scripts/parse-ubl-structure.mts $(INVOICE_SCHEMA_DEPENDENCIES)
	$(NPX) tsx $< >$@ || rm -f $@
	$(NPX) ajv compile --spec=draft2019 -s $@ || rm -f $@

src/invoice/invoice.interface.ts: scripts/json-schema-to-interface.mts src/schema/ubl-invoice.schema.json
	$(NPX) tsx $< src/schema/ubl-invoice.schema.json $@

src/schema/mapping.schema.json: scripts/transform-ubl-mapping.mts src/schema/ubl-invoice.schema.json
	$(NPX) tsx $< src/schema/ubl-invoice.schema.json $@
	$(NPX) ajv compile --spec=draft2019 -s $@ || rm -f $@

src/mapping/mapping.interface.ts: scripts/json-schema-to-interface.mts src/schema/ubl-mapping.schema.json
	$(NPX) tsx $< src/schema/ubl-mapping.schema.json $@

.PHONY: clean

clean:
	rm -f src/schema/*.json \
		src/invoice/invoice.interface.ts src/mapping/mapping.interface.ts
