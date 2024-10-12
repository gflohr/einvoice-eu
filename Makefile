default: all

NPX = npx

INVOICE_SCHEMA_DEPENDENCIES = \
	peppol-bis-invoice-3/structure/syntax/ubl-invoice.xml \
	peppol-bis-invoice-3/structure/codelist/*.xml

all: \
	src/schema/invoice.schema.json

src/schema/invoice.schema.json: scripts/parse-ubl-structure.mts $(INVOICE_SCHEMA_DEPENDENCIES)
	$(NPX) tsx $< >$@ || rm -f $@
	$(NPX) ajv compile -s $@ || rm -f $@


.PHONY: clean

clean:
	rm -f src/schema/*.json
