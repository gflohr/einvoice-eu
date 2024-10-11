default: all

NPX = npx

INVOICE_SCHEMA_DEPENDENCIES = \
	src/schema/invoice.x-schema.yaml \
	scripts/parse-invoice-schema.mts

all: \
	src/schema/invoice.schema.json

src/schema/invoice.schema.json: $(INVOICE_SCHEMA_DEPENDENCIES)
	$(NPX) tsx scripts/parse-invoice-schema.mts $< >$@ || rm -f $@
	$(NPX) ajv compile -s $@ || rm -f $@


.PHONY: clean

clean:
	rm -f src/schema/*.json
