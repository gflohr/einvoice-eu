# Mapping

Mappings map cells from an invoice spreadsheet file to invoice data.

- [Mapping](#mapping)
	- [Format](#format)
	- [General Structure](#general-structure)
		- [The `meta` Object](#the-meta-object)
			- [The `meta.sectionColumn` Object](#the-metasectioncolumn-object)
		- [The `ubl:Invoice` Object](#the-ublinvoice-object)
			- [Tab References](#tab-references)
			- [Cell Reference](#cell-reference)
			- [Section Reference](#section-reference)
			- [Hard-Coded Values](#hard-coded-values)
	- [Examples](#examples)

## Format

The format used is [YAML](https://yaml.org/). YAML is a strict superset of
[JSON](https://www.json.org/) so that you can also use JSON.

## General Structure

The overall structure of a mapping is an object (also known as a hash,
dictionary, or associative array) with named properties like `meta` and
`ublInvoice`.

### The `meta` Object

The keys of the `meta` object contain aids for interpreting the actual mapping.

#### The `meta.sectionColumn` Object

They keys of this object are the names of the tabs in the invoice files.
The value are column names which are sequences of at least one uppercase
letter `A` to `Z`.

The meaning of this key becomes later.

### The `ubl:Invoice` Object

Did we say that a mapping maps cells to invoice data? It is actually the other
way round.  The invoice data is mapped from a reference to the invoice data to
the corresponding cell, where it can be found.

The structure matches exactly the structure of invoice data, only that all
values are a reference to a cell where the data can be found in the spreadsheet.
Another difference is that there are no arrays but data inside an array is
directly mapped to the first item of that array.  This will also become clearer
later.

Let's look at an excerpt of an actual mapping:

```yaml
meta:
	sectionColumn:
		# The section column of tab "Invoice" is "K".
		Invoice: K
ubl:Invoice:
	# The invoice id is found in the cell D7 of the tab "Invoice".
	cbc:ID: Invoice.D7
	# The tab can be omitted and defaults to the first tab of the spreadsheet.
	cbc:IssueDate: F7
	# ... more properties following.
	# The property `cac:InvoiceLine` is actually an array.
	cac:InvoiceLine:
		# But we directly map to the first item.  The id of an invoice line
		# is actually not in cell A1 but in column A of the 1st row of the
		# section "Invoice Items".
		cbc:ID: Invoice.A1[Invoice Items]
		# ... more properties following
		cac:Item:
			cbcName: Invoice.B1[Invoice Items]
		cac:Price:
			cbc:PriceAmount: Invoice.F1[Invoice Items]
			# You can also hard-code values by prefixing them with an
			# asterisk.  Here, the currency code for the item is hard-coded
			# to "EUR".
			cbc:PriceAmount@currencyCode: :EUR
		# ... more properties following.
```

#### Tab References

The name of a tab is an arbitrary string with these constraints:

- It must not be empty.
- It must be unique.
- It must not contain the letters `[`, `]`, `*`, `?`, `:`, `/`, or `\`.
- It must not begin or end with a single-quote `'`.

These constraints are actually imposed by your spreadsheet application.

If you omit the tab name in a cell reference, it defaults to the name of the
first tab.

#### Cell Reference

The cell reference is separate by a dot `.` from the tab reference and is a
sequence of uppercase letters followed by a positive decimal number greater
than 0.

#### Section Reference

Some parts of an invoice can occur multiple times.  A typical example are
the invoice lines.  That means that the parts of an invoice line cannot be
mapped directly to a cell because the exact row depends on the number of
invoice lines present.  The same applies to all data that is following the
invoice lines.

All these references have therefore to be dynamic.  This is achieved as follows:

1. For each tab, one column is reserved for the names of the sections.
2. The name of the first section can be empty and can be omitted in references. All following sections must have a name without the characters `.`, `[` and `]`.
3. The section reference is put into angle brackets after the tab and cell reference, for example `Invoice.F3[Footer]`.
4. The row number of the cell reference is relative to the beginning of the corresponding section.
5. Section references may be nested, for example `Invoice.G7[Footer.VATBreakdown]`.
6. Each item inside a section must be marked with the section name in the `SectionColumn` (see above) for the current tab.

If the section reference is omitted it is assumed that there is just one item present.

#### Hard-Coded Values

Instead of a reference to a certain cell, you can also just hard-code values.
If you map to a string that begins with a colon `:`, everything following
the colon is interpreted as the value.

## Examples

The directory `contrib/templates` contains examples for spreadsheets.  The
directory `resources/mappings` contain the corresponsing mappings for these
spreadsheets.

