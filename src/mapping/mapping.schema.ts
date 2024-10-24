/*
 * This file is generated from 'src/schema/mapping.schema.json'.
 * Do not edit!
 */

import { JSONSchemaType } from 'ajv';
import { Mapping } from './mapping.interface';

export const mappingSchema: JSONSchemaType<Mapping> = {
	$schema: 'https://json-schema.org/draft/2019-09/schema',
	$id: 'https://www.cantanea.com/schemas/ubl-invoice-schema-v0.1.0',
	type: 'object',
	title: 'Mapping',
	description: 'Maps invoice data to the cells in a spreadsheet.',
	properties: {
		meta: {
			type: 'object',
			additionalProperties: false,
			title: 'Mapping Meta Information',
			description: 'Auxiliary information for the mapping data.',
			properties: {
				sectionColumn: {
					type: 'object',
					additionalProperties: {
						type: 'string',
						pattern: '^[A-Z]+$',
					},
				},
			},
			required: ['sectionColumn'],
		},
		'ubl:Invoice': {
			type: 'object',
			properties: {
				'cbc:CustomizationID': {
					$ref: '#/$defs/valueRef',
				},
				'cbc:ProfileID': {
					$ref: '#/$defs/valueRef',
				},
				'cbc:ID': {
					$ref: '#/$defs/valueRef',
				},
				'cbc:IssueDate': {
					$ref: '#/$defs/valueRef',
				},
				'cbc:DueDate': {
					$ref: '#/$defs/valueRef',
				},
				'cbc:InvoiceTypeCode': {
					$ref: '#/$defs/valueRef',
				},
				'cbc:Note': {
					$ref: '#/$defs/valueRef',
				},
				'cbc:TaxPointDate': {
					$ref: '#/$defs/valueRef',
				},
				'cbc:DocumentCurrencyCode': {
					$ref: '#/$defs/valueRef',
				},
				'cbc:TaxCurrencyCode': {
					$ref: '#/$defs/valueRef',
				},
				'cbc:AccountingCost': {
					$ref: '#/$defs/valueRef',
				},
				'cbc:BuyerReference': {
					$ref: '#/$defs/valueRef',
				},
				'cac:InvoicePeriod': {
					type: 'object',
					title: 'DELIVERY OR INVOICE PERIOD',
					description:
						'A group of business terms providing information on the invoice period. Also called delivery period. \n                If the group is used, the invoiceing period start date and/or end date must be used.',
					properties: {
						'cbc:StartDate': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:EndDate': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:DescriptionCode': {
							$ref: '#/$defs/valueRef',
						},
					},
				},
				'cac:OrderReference': {
					type: 'object',
					title: 'ORDER AND SALES ORDER REFERENCE',
					properties: {
						'cbc:ID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:SalesOrderID': {
							$ref: '#/$defs/valueRef',
						},
					},
					required: ['cbc:ID'],
				},
				'cac:BillingReference': {
					type: 'object',
					properties: {
						section: {
							$ref: '#/$defs/sectionRef',
						},
						'cac:InvoiceDocumentReference': {
							type: 'object',
							title: 'INVOICE DOCUMENT REFERENCE',
							properties: {
								'cbc:ID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:IssueDate': {
									$ref: '#/$defs/valueRef',
								},
							},
							required: ['cbc:ID'],
						},
					},
					required: ['section', 'cac:InvoiceDocumentReference'],
				},
				'cac:DespatchDocumentReference': {
					type: 'object',
					title: 'DESPATCH ADVICE REFERENCE',
					properties: {
						'cbc:ID': {
							$ref: '#/$defs/valueRef',
						},
					},
					required: ['cbc:ID'],
				},
				'cac:ReceiptDocumentReference': {
					type: 'object',
					title: 'RECEIPT ADVICE REFERENCE',
					properties: {
						'cbc:ID': {
							$ref: '#/$defs/valueRef',
						},
					},
					required: ['cbc:ID'],
				},
				'cac:OriginatorDocumentReference': {
					type: 'object',
					title: 'TENDER OR LOT REFERENCE',
					properties: {
						'cbc:ID': {
							$ref: '#/$defs/valueRef',
						},
					},
					required: ['cbc:ID'],
				},
				'cac:ContractDocumentReference': {
					type: 'object',
					title: 'CONTRACT REFERENCE',
					properties: {
						'cbc:ID': {
							$ref: '#/$defs/valueRef',
						},
					},
					required: ['cbc:ID'],
				},
				'cac:AdditionalDocumentReference': {
					type: 'object',
					properties: {
						section: {
							$ref: '#/$defs/sectionRef',
						},
						'cbc:ID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:ID@schemeID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:DocumentTypeCode': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:DocumentDescription': {
							$ref: '#/$defs/valueRef',
						},
						'cac:Attachment': {
							type: 'object',
							title: 'ATTACHMENT',
							properties: {
								'cbc:EmbeddedDocumentBinaryObject': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:EmbeddedDocumentBinaryObject@mimeCode': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:EmbeddedDocumentBinaryObject@filename': {
									$ref: '#/$defs/valueRef',
								},
								'cac:ExternalReference': {
									type: 'object',
									title: 'EXTERNAL REFERENCE',
									properties: {
										'cbc:URI': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:URI'],
								},
							},
							required: [],
							dependentRequired: {
								'cbc:EmbeddedDocumentBinaryObject': [
									'cbc:EmbeddedDocumentBinaryObject@mimeCode',
									'cbc:EmbeddedDocumentBinaryObject@filename',
								],
								'cbc:EmbeddedDocumentBinaryObject@mimeCode': [
									'cbc:EmbeddedDocumentBinaryObject',
								],
								'cbc:EmbeddedDocumentBinaryObject@filename': [
									'cbc:EmbeddedDocumentBinaryObject',
								],
							},
						},
					},
					required: ['section', 'cbc:ID'],
					dependentRequired: {
						'cbc:ID@schemeID': ['cbc:ID'],
					},
				},
				'cac:ProjectReference': {
					type: 'object',
					title: 'PROJECT REFERENCE',
					properties: {
						'cbc:ID': {
							$ref: '#/$defs/valueRef',
						},
					},
					required: ['cbc:ID'],
				},
				'cac:AccountingSupplierParty': {
					type: 'object',
					title: 'SELLER',
					description:
						'A group of business terms providing information about the Seller.',
					properties: {
						'cac:Party': {
							type: 'object',
							title: 'PARTY',
							properties: {
								'cbc:EndpointID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:EndpointID@schemeID': {
									$ref: '#/$defs/valueRef',
								},
								'cac:PartyIdentification': {
									type: 'object',
									properties: {
										section: {
											$ref: '#/$defs/sectionRef',
										},
										'cbc:ID': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:ID@schemeID': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['section', 'cbc:ID'],
									dependentRequired: {
										'cbc:ID@schemeID': ['cbc:ID'],
									},
								},
								'cac:PartyName': {
									type: 'object',
									title: 'PARTY NAME',
									properties: {
										'cbc:Name': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:Name'],
								},
								'cac:PostalAddress': {
									type: 'object',
									title: 'SELLER POSTAL ADDRESS',
									description:
										'A group of business terms providing information about the address of the Seller. \n                    Sufficient components of the address are to be filled to comply with legal requirements.',
									properties: {
										'cbc:StreetName': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:AdditionalStreetName': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:CityName': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:PostalZone': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:CountrySubentity': {
											$ref: '#/$defs/valueRef',
										},
										'cac:AddressLine': {
											type: 'object',
											title: 'ADDRESS LINE',
											properties: {
												'cbc:Line': {
													$ref: '#/$defs/valueRef',
												},
											},
											required: ['cbc:Line'],
										},
										'cac:Country': {
											type: 'object',
											title: 'COUNTRY',
											properties: {
												'cbc:IdentificationCode': {
													$ref: '#/$defs/valueRef',
												},
											},
											required: ['cbc:IdentificationCode'],
										},
									},
									required: ['cac:Country'],
								},
								'cac:PartyTaxScheme': {
									type: 'object',
									properties: {
										section: {
											$ref: '#/$defs/sectionRef',
										},
										'cbc:CompanyID': {
											$ref: '#/$defs/valueRef',
										},
										'cac:TaxScheme': {
											type: 'object',
											title: 'TAX SCHEME',
											properties: {
												'cbc:ID': {
													$ref: '#/$defs/valueRef',
												},
											},
											required: ['cbc:ID'],
										},
									},
									required: ['section', 'cbc:CompanyID', 'cac:TaxScheme'],
								},
								'cac:PartyLegalEntity': {
									type: 'object',
									title: 'PARTY LEGAL ENTITY',
									properties: {
										'cbc:RegistrationName': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:CompanyID': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:CompanyID@schemeID': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:CompanyLegalForm': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:RegistrationName'],
									dependentRequired: {
										'cbc:CompanyID@schemeID': ['cbc:CompanyID'],
									},
								},
								'cac:Contact': {
									type: 'object',
									title: 'SELLER CONTACT',
									description:
										'A group of business terms providing contact information about the Seller.',
									properties: {
										'cbc:Name': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:Telephone': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:ElectronicMail': {
											$ref: '#/$defs/valueRef',
										},
									},
								},
							},
							required: [
								'cbc:EndpointID',
								'cac:PostalAddress',
								'cac:PartyLegalEntity',
							],
							dependentRequired: {
								'cbc:EndpointID': ['cbc:EndpointID@schemeID'],
								'cbc:EndpointID@schemeID': ['cbc:EndpointID'],
							},
						},
					},
					required: ['cac:Party'],
				},
				'cac:AccountingCustomerParty': {
					type: 'object',
					title: 'BUYER',
					description:
						'A group of business terms providing information about the Buyer.',
					properties: {
						'cac:Party': {
							type: 'object',
							title: 'PARTY',
							properties: {
								'cbc:EndpointID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:EndpointID@schemeID': {
									$ref: '#/$defs/valueRef',
								},
								'cac:PartyIdentification': {
									type: 'object',
									title: 'PARTY IDENTIFICATION',
									properties: {
										'cbc:ID': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:ID@schemeID': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:ID'],
									dependentRequired: {
										'cbc:ID@schemeID': ['cbc:ID'],
									},
								},
								'cac:PartyName': {
									type: 'object',
									title: 'PARTY NAME',
									properties: {
										'cbc:Name': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:Name'],
								},
								'cac:PostalAddress': {
									type: 'object',
									title: 'BUYER POSTAL ADDRESS',
									description:
										'A group of business terms providing information about the postal address for the Buyer.\n                    Sufficient components of the address are to be filled to comply with legal requirements.',
									properties: {
										'cbc:StreetName': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:AdditionalStreetName': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:CityName': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:PostalZone': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:CountrySubentity': {
											$ref: '#/$defs/valueRef',
										},
										'cac:AddressLine': {
											type: 'object',
											title: 'ADDRESS LINE',
											properties: {
												'cbc:Line': {
													$ref: '#/$defs/valueRef',
												},
											},
											required: ['cbc:Line'],
										},
										'cac:Country': {
											type: 'object',
											title: 'COUNTRY',
											properties: {
												'cbc:IdentificationCode': {
													$ref: '#/$defs/valueRef',
												},
											},
											required: ['cbc:IdentificationCode'],
										},
									},
									required: ['cac:Country'],
								},
								'cac:PartyTaxScheme': {
									type: 'object',
									title: 'PARTY VAT IDENTIFIER',
									properties: {
										'cbc:CompanyID': {
											$ref: '#/$defs/valueRef',
										},
										'cac:TaxScheme': {
											type: 'object',
											title: 'TAX SCHEME',
											properties: {
												'cbc:ID': {
													$ref: '#/$defs/valueRef',
												},
											},
											required: ['cbc:ID'],
										},
									},
									required: ['cbc:CompanyID', 'cac:TaxScheme'],
								},
								'cac:PartyLegalEntity': {
									type: 'object',
									title: 'PARTY LEGAL ENTITY',
									properties: {
										'cbc:RegistrationName': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:CompanyID': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:CompanyID@schemeID': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:RegistrationName'],
									dependentRequired: {
										'cbc:CompanyID@schemeID': ['cbc:CompanyID'],
									},
								},
								'cac:Contact': {
									type: 'object',
									title: 'BUYER CONTACT',
									description:
										'A group of business terms providing contact information relevant for the Buyer.',
									properties: {
										'cbc:Name': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:Telephone': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:ElectronicMail': {
											$ref: '#/$defs/valueRef',
										},
									},
								},
							},
							required: [
								'cbc:EndpointID',
								'cac:PostalAddress',
								'cac:PartyLegalEntity',
							],
							dependentRequired: {
								'cbc:EndpointID': ['cbc:EndpointID@schemeID'],
								'cbc:EndpointID@schemeID': ['cbc:EndpointID'],
							},
						},
					},
					required: ['cac:Party'],
				},
				'cac:PayeeParty': {
					type: 'object',
					title: 'PAYEE',
					description:
						'A group of business terms providing information about the Payee, i.e. the role that receives the\n            payment.  Shall be used when the Payee is different from the Seller.',
					properties: {
						'cac:PartyIdentification': {
							type: 'object',
							title: 'PARTY IDENTIFICATION',
							properties: {
								'cbc:ID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:ID@schemeID': {
									$ref: '#/$defs/valueRef',
								},
							},
							required: ['cbc:ID'],
							dependentRequired: {
								'cbc:ID@schemeID': ['cbc:ID'],
							},
						},
						'cac:PartyName': {
							type: 'object',
							title: 'PARTY NAME',
							properties: {
								'cbc:Name': {
									$ref: '#/$defs/valueRef',
								},
							},
							required: ['cbc:Name'],
						},
						'cac:PartyLegalEntity': {
							type: 'object',
							title: 'PARTY LEGAL ENTITY',
							properties: {
								'cbc:CompanyID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:CompanyID@schemeID': {
									$ref: '#/$defs/valueRef',
								},
							},
							required: ['cbc:CompanyID'],
							dependentRequired: {
								'cbc:CompanyID@schemeID': ['cbc:CompanyID'],
							},
						},
					},
					required: ['cac:PartyName'],
				},
				'cac:TaxRepresentativeParty': {
					type: 'object',
					title: 'SELLER TAX REPRESENTATIVE PARTY',
					description:
						"A group of business terms providing information about the Seller's tax representative.",
					properties: {
						'cac:PartyName': {
							type: 'object',
							title: 'PARTY NAME',
							properties: {
								'cbc:Name': {
									$ref: '#/$defs/valueRef',
								},
							},
							required: ['cbc:Name'],
						},
						'cac:PostalAddress': {
							type: 'object',
							title: 'SELLER TAX REPRESENTATIVE POSTAL ADDRESS',
							description:
								'A group of business terms providing information about the postal address for the tax representative\n                party. Sufficient components of the address are to be filled to comply with legal requirements.',
							properties: {
								'cbc:StreetName': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:AdditionalStreetName': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:CityName': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:PostalZone': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:CountrySubentity': {
									$ref: '#/$defs/valueRef',
								},
								'cac:AddressLine': {
									type: 'object',
									title: 'ADDRESS LINE',
									properties: {
										'cbc:Line': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:Line'],
								},
								'cac:Country': {
									type: 'object',
									title: 'COUNTRY',
									properties: {
										'cbc:IdentificationCode': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:IdentificationCode'],
								},
							},
							required: ['cac:Country'],
						},
						'cac:PartyTaxScheme': {
							type: 'object',
							title: 'PARTY VAT IDENTIFIER',
							properties: {
								'cbc:CompanyID': {
									$ref: '#/$defs/valueRef',
								},
								'cac:TaxScheme': {
									type: 'object',
									title: 'TAX SCHEME',
									properties: {
										'cbc:ID': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:ID'],
								},
							},
							required: ['cbc:CompanyID', 'cac:TaxScheme'],
						},
					},
					required: [
						'cac:PartyName',
						'cac:PostalAddress',
						'cac:PartyTaxScheme',
					],
				},
				'cac:Delivery': {
					type: 'object',
					title: 'DELIVERY INFORMATION',
					description:
						'A group of business terms providing information about where and when the goods and services\n            invoiced are delivered.',
					properties: {
						'cbc:ActualDeliveryDate': {
							$ref: '#/$defs/valueRef',
						},
						'cac:DeliveryLocation': {
							type: 'object',
							properties: {
								'cbc:ID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:ID@schemeID': {
									$ref: '#/$defs/valueRef',
								},
								'cac:Address': {
									type: 'object',
									title: 'DELIVER TO ADDRESS',
									description:
										'A group of business terms providing information about the address to which goods and services\n                    invoiced were or are delivered.',
									properties: {
										'cbc:StreetName': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:AdditionalStreetName': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:CityName': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:PostalZone': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:CountrySubentity': {
											$ref: '#/$defs/valueRef',
										},
										'cac:AddressLine': {
											type: 'object',
											title: 'ADDRESS LINE',
											properties: {
												'cbc:Line': {
													$ref: '#/$defs/valueRef',
												},
											},
											required: ['cbc:Line'],
										},
										'cac:Country': {
											type: 'object',
											title: 'COUNTRY',
											properties: {
												'cbc:IdentificationCode': {
													$ref: '#/$defs/valueRef',
												},
											},
											required: ['cbc:IdentificationCode'],
										},
									},
									required: ['cac:Country'],
								},
							},
							dependentRequired: {
								'cbc:ID@schemeID': ['cbc:ID'],
							},
						},
						'cac:DeliveryParty': {
							type: 'object',
							title: 'DELIVER PARTY',
							properties: {
								'cac:PartyName': {
									type: 'object',
									title: 'PARTY NAME',
									properties: {
										'cbc:Name': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:Name'],
								},
							},
							required: ['cac:PartyName'],
						},
					},
				},
				'cac:PaymentMeans': {
					type: 'object',
					properties: {
						section: {
							$ref: '#/$defs/sectionRef',
						},
						'cbc:PaymentMeansCode': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:PaymentMeansCode@name': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:PaymentID': {
							$ref: '#/$defs/valueRef',
						},
						'cac:CardAccount': {
							type: 'object',
							title: 'PAYMENT CARD INFORMATION',
							description:
								'A group of business terms providing information about card used for payment contemporaneous with\n                invoice issuance.',
							properties: {
								'cbc:PrimaryAccountNumberID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:NetworkID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:HolderName': {
									$ref: '#/$defs/valueRef',
								},
							},
							required: ['cbc:PrimaryAccountNumberID', 'cbc:NetworkID'],
						},
						'cac:PayeeFinancialAccount': {
							type: 'object',
							title: 'CREDIT TRANSFER',
							description:
								'A group of business terms to specify credit transfer payments.',
							properties: {
								'cbc:ID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:Name': {
									$ref: '#/$defs/valueRef',
								},
								'cac:FinancialInstitutionBranch': {
									type: 'object',
									title: 'FINANCIAL INSTITUTION BRANCH',
									properties: {
										'cbc:ID': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:ID'],
								},
							},
							required: ['cbc:ID'],
						},
						'cac:PaymentMandate': {
							type: 'object',
							title: 'DIRECT DEBIT',
							description:
								'A group of business terms to specify a direct debit.',
							properties: {
								'cbc:ID': {
									$ref: '#/$defs/valueRef',
								},
								'cac:PayerFinancialAccount': {
									type: 'object',
									title: 'PAYER FINANCIAL ACCOUNT',
									properties: {
										'cbc:ID': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:ID'],
								},
							},
						},
					},
					required: ['section', 'cbc:PaymentMeansCode'],
					dependentRequired: {
						'cbc:PaymentMeansCode@name': ['cbc:PaymentMeansCode'],
					},
				},
				'cac:PaymentTerms': {
					type: 'object',
					title: 'PAYMENT TERMS',
					properties: {
						'cbc:Note': {
							$ref: '#/$defs/valueRef',
						},
					},
					required: ['cbc:Note'],
				},
				'cac:AllowanceCharge': {
					type: 'object',
					properties: {
						section: {
							$ref: '#/$defs/sectionRef',
						},
						'cbc:ChargeIndicator': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:AllowanceChargeReasonCode': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:AllowanceChargeReason': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:MultiplierFactorNumeric': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:Amount': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:Amount@currencyID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:BaseAmount': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:BaseAmount@currencyID': {
							$ref: '#/$defs/valueRef',
						},
						'cac:TaxCategory': {
							type: 'object',
							title: 'TAX CATEGORY',
							properties: {
								'cbc:ID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:Percent': {
									$ref: '#/$defs/valueRef',
								},
								'cac:TaxScheme': {
									type: 'object',
									title: 'TAX SCHEME',
									properties: {
										'cbc:ID': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:ID'],
								},
							},
							required: ['cbc:ID', 'cac:TaxScheme'],
						},
					},
					required: [
						'section',
						'cbc:ChargeIndicator',
						'cbc:Amount',
						'cac:TaxCategory',
					],
					dependentRequired: {
						'cbc:Amount': ['cbc:Amount@currencyID'],
						'cbc:BaseAmount': ['cbc:BaseAmount@currencyID'],
						'cbc:Amount@currencyID': ['cbc:Amount'],
						'cbc:BaseAmount@currencyID': ['cbc:BaseAmount'],
					},
				},
				'cac:TaxTotal': {
					type: 'object',
					properties: {
						section: {
							$ref: '#/$defs/sectionRef',
						},
						'cbc:TaxAmount': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:TaxAmount@currencyID': {
							$ref: '#/$defs/valueRef',
						},
						'cac:TaxSubtotal': {
							type: 'object',
							properties: {
								section: {
									$ref: '#/$defs/sectionRef',
								},
								'cbc:TaxableAmount': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:TaxableAmount@currencyID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:TaxAmount': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:TaxAmount@currencyID': {
									$ref: '#/$defs/valueRef',
								},
								'cac:TaxCategory': {
									type: 'object',
									title: 'VAT CATEGORY',
									properties: {
										'cbc:ID': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:Percent': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:TaxExemptionReasonCode': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:TaxExemptionReason': {
											$ref: '#/$defs/valueRef',
										},
										'cac:TaxScheme': {
											type: 'object',
											title: 'TAX SCHEME',
											properties: {
												'cbc:ID': {
													$ref: '#/$defs/valueRef',
												},
											},
											required: ['cbc:ID'],
										},
									},
									required: ['cbc:ID', 'cac:TaxScheme'],
								},
							},
							required: [
								'section',
								'cbc:TaxableAmount',
								'cbc:TaxAmount',
								'cac:TaxCategory',
							],
							dependentRequired: {
								'cbc:TaxableAmount': ['cbc:TaxableAmount@currencyID'],
								'cbc:TaxAmount': ['cbc:TaxAmount@currencyID'],
								'cbc:TaxableAmount@currencyID': ['cbc:TaxableAmount'],
								'cbc:TaxAmount@currencyID': ['cbc:TaxAmount'],
							},
						},
					},
					required: ['section', 'cbc:TaxAmount'],
					dependentRequired: {
						'cbc:TaxAmount': ['cbc:TaxAmount@currencyID'],
						'cbc:TaxAmount@currencyID': ['cbc:TaxAmount'],
					},
				},
				'cac:LegalMonetaryTotal': {
					type: 'object',
					title: 'DOCUMENT TOTALS',
					description:
						'A group of business terms providing the monetary totals for the Invoice.',
					properties: {
						'cbc:LineExtensionAmount': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:LineExtensionAmount@currencyID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:TaxExclusiveAmount': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:TaxExclusiveAmount@currencyID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:TaxInclusiveAmount': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:TaxInclusiveAmount@currencyID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:AllowanceTotalAmount': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:AllowanceTotalAmount@currencyID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:ChargeTotalAmount': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:ChargeTotalAmount@currencyID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:PrepaidAmount': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:PrepaidAmount@currencyID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:PayableRoundingAmount': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:PayableRoundingAmount@currencyID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:PayableAmount': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:PayableAmount@currencyID': {
							$ref: '#/$defs/valueRef',
						},
					},
					required: [
						'cbc:LineExtensionAmount',
						'cbc:TaxExclusiveAmount',
						'cbc:TaxInclusiveAmount',
						'cbc:PayableAmount',
					],
					dependentRequired: {
						'cbc:LineExtensionAmount': ['cbc:LineExtensionAmount@currencyID'],
						'cbc:TaxExclusiveAmount': ['cbc:TaxExclusiveAmount@currencyID'],
						'cbc:TaxInclusiveAmount': ['cbc:TaxInclusiveAmount@currencyID'],
						'cbc:AllowanceTotalAmount': ['cbc:AllowanceTotalAmount@currencyID'],
						'cbc:ChargeTotalAmount': ['cbc:ChargeTotalAmount@currencyID'],
						'cbc:PrepaidAmount': ['cbc:PrepaidAmount@currencyID'],
						'cbc:PayableRoundingAmount': [
							'cbc:PayableRoundingAmount@currencyID',
						],
						'cbc:PayableAmount': ['cbc:PayableAmount@currencyID'],
						'cbc:LineExtensionAmount@currencyID': ['cbc:LineExtensionAmount'],
						'cbc:TaxExclusiveAmount@currencyID': ['cbc:TaxExclusiveAmount'],
						'cbc:TaxInclusiveAmount@currencyID': ['cbc:TaxInclusiveAmount'],
						'cbc:AllowanceTotalAmount@currencyID': ['cbc:AllowanceTotalAmount'],
						'cbc:ChargeTotalAmount@currencyID': ['cbc:ChargeTotalAmount'],
						'cbc:PrepaidAmount@currencyID': ['cbc:PrepaidAmount'],
						'cbc:PayableRoundingAmount@currencyID': [
							'cbc:PayableRoundingAmount',
						],
						'cbc:PayableAmount@currencyID': ['cbc:PayableAmount'],
					},
				},
				'cac:InvoiceLine': {
					type: 'object',
					properties: {
						section: {
							$ref: '#/$defs/sectionRef',
						},
						'cbc:ID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:Note': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:InvoicedQuantity': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:InvoicedQuantity@unitCode': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:LineExtensionAmount': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:LineExtensionAmount@currencyID': {
							$ref: '#/$defs/valueRef',
						},
						'cbc:AccountingCost': {
							$ref: '#/$defs/valueRef',
						},
						'cac:InvoicePeriod': {
							type: 'object',
							title: 'INVOICE LINE PERIOD',
							description:
								'A group of business terms providing information about the period relevant for the Invoice line.',
							properties: {
								'cbc:StartDate': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:EndDate': {
									$ref: '#/$defs/valueRef',
								},
							},
						},
						'cac:OrderLineReference': {
							type: 'object',
							title: 'ORDER LINE REFERENCE',
							properties: {
								'cbc:LineID': {
									$ref: '#/$defs/valueRef',
								},
							},
							required: ['cbc:LineID'],
						},
						'cac:DocumentReference': {
							type: 'object',
							title: 'LINE OBJECT IDENTIFIER',
							properties: {
								'cbc:ID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:ID@schemeID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:DocumentTypeCode': {
									$ref: '#/$defs/valueRef',
								},
							},
							required: ['cbc:ID', 'cbc:DocumentTypeCode'],
							dependentRequired: {
								'cbc:ID@schemeID': ['cbc:ID'],
							},
						},
						'cac:AllowanceCharge': {
							type: 'object',
							properties: {
								section: {
									$ref: '#/$defs/sectionRef',
								},
								'cbc:ChargeIndicator': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:AllowanceChargeReasonCode': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:AllowanceChargeReason': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:MultiplierFactorNumeric': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:Amount': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:Amount@currencyID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:BaseAmount': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:BaseAmount@currencyID': {
									$ref: '#/$defs/valueRef',
								},
							},
							required: ['section', 'cbc:ChargeIndicator', 'cbc:Amount'],
							dependentRequired: {
								'cbc:Amount': ['cbc:Amount@currencyID'],
								'cbc:BaseAmount': ['cbc:BaseAmount@currencyID'],
								'cbc:Amount@currencyID': ['cbc:Amount'],
								'cbc:BaseAmount@currencyID': ['cbc:BaseAmount'],
							},
						},
						'cac:Item': {
							type: 'object',
							title: 'ITEM INFORMATION',
							description:
								'A group of business terms providing information about the goods and services invoiced.',
							properties: {
								'cbc:Description': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:Name': {
									$ref: '#/$defs/valueRef',
								},
								'cac:BuyersItemIdentification': {
									type: 'object',
									title: 'BUYERS ITEM IDENTIFICATION',
									properties: {
										'cbc:ID': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:ID'],
								},
								'cac:SellersItemIdentification': {
									type: 'object',
									title: 'SELLERS ITEM IDENTIFICATION',
									properties: {
										'cbc:ID': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:ID'],
								},
								'cac:StandardItemIdentification': {
									type: 'object',
									title: 'STANDARD ITEM IDENTIFICATION',
									properties: {
										'cbc:ID': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:ID@schemeID': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:ID'],
									dependentRequired: {
										'cbc:ID': ['cbc:ID@schemeID'],
										'cbc:ID@schemeID': ['cbc:ID'],
									},
								},
								'cac:OriginCountry': {
									type: 'object',
									title: 'ORIGIN COUNTRY',
									properties: {
										'cbc:IdentificationCode': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:IdentificationCode'],
								},
								'cac:CommodityClassification': {
									type: 'object',
									properties: {
										section: {
											$ref: '#/$defs/sectionRef',
										},
										'cbc:ItemClassificationCode': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:ItemClassificationCode@listID': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:ItemClassificationCode@listVersionID': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['section', 'cbc:ItemClassificationCode'],
									dependentRequired: {
										'cbc:ItemClassificationCode': [
											'cbc:ItemClassificationCode@listID',
										],
										'cbc:ItemClassificationCode@listID': [
											'cbc:ItemClassificationCode',
										],
										'cbc:ItemClassificationCode@listVersionID': [
											'cbc:ItemClassificationCode',
										],
									},
								},
								'cac:ClassifiedTaxCategory': {
									type: 'object',
									title: 'LINE VAT INFORMATION',
									description:
										'A group of business terms providing information about the VAT applicable for the goods and services\n                invoiced on the Invoice line.',
									properties: {
										'cbc:ID': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:Percent': {
											$ref: '#/$defs/valueRef',
										},
										'cac:TaxScheme': {
											type: 'object',
											title: 'TAX SCHEME',
											properties: {
												'cbc:ID': {
													$ref: '#/$defs/valueRef',
												},
											},
											required: ['cbc:ID'],
										},
									},
									required: ['cbc:ID', 'cac:TaxScheme'],
								},
								'cac:AdditionalItemProperty': {
									type: 'object',
									properties: {
										section: {
											$ref: '#/$defs/sectionRef',
										},
										'cbc:Name': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:Value': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['section', 'cbc:Name', 'cbc:Value'],
								},
							},
							required: ['cbc:Name', 'cac:ClassifiedTaxCategory'],
						},
						'cac:Price': {
							type: 'object',
							title: 'PRICE DETAILS',
							description:
								'A group of business terms providing information about the price applied for the goods and services\n            invoiced on the Invoice line.',
							properties: {
								'cbc:PriceAmount': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:PriceAmount@currencyID': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:BaseQuantity': {
									$ref: '#/$defs/valueRef',
								},
								'cbc:BaseQuantity@unitCode': {
									$ref: '#/$defs/valueRef',
								},
								'cac:AllowanceCharge': {
									type: 'object',
									title: 'ALLOWANCE',
									properties: {
										'cbc:ChargeIndicator': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:Amount': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:Amount@currencyID': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:BaseAmount': {
											$ref: '#/$defs/valueRef',
										},
										'cbc:BaseAmount@currencyID': {
											$ref: '#/$defs/valueRef',
										},
									},
									required: ['cbc:ChargeIndicator', 'cbc:Amount'],
									dependentRequired: {
										'cbc:Amount': ['cbc:Amount@currencyID'],
										'cbc:BaseAmount': ['cbc:BaseAmount@currencyID'],
										'cbc:Amount@currencyID': ['cbc:Amount'],
										'cbc:BaseAmount@currencyID': ['cbc:BaseAmount'],
									},
								},
							},
							required: ['cbc:PriceAmount'],
							dependentRequired: {
								'cbc:PriceAmount': ['cbc:PriceAmount@currencyID'],
								'cbc:PriceAmount@currencyID': ['cbc:PriceAmount'],
								'cbc:BaseQuantity@unitCode': ['cbc:BaseQuantity'],
							},
						},
					},
					required: [
						'section',
						'cbc:ID',
						'cbc:InvoicedQuantity',
						'cbc:LineExtensionAmount',
						'cac:Item',
						'cac:Price',
					],
					dependentRequired: {
						'cbc:InvoicedQuantity': ['cbc:InvoicedQuantity@unitCode'],
						'cbc:LineExtensionAmount': ['cbc:LineExtensionAmount@currencyID'],
						'cbc:InvoicedQuantity@unitCode': ['cbc:InvoicedQuantity'],
						'cbc:LineExtensionAmount@currencyID': ['cbc:LineExtensionAmount'],
					},
				},
			},
			required: [
				'cbc:CustomizationID',
				'cbc:ProfileID',
				'cbc:ID',
				'cbc:IssueDate',
				'cbc:InvoiceTypeCode',
				'cbc:DocumentCurrencyCode',
				'cac:AccountingSupplierParty',
				'cac:AccountingCustomerParty',
				'cac:TaxTotal',
				'cac:LegalMonetaryTotal',
				'cac:InvoiceLine',
			],
		},
	},
	required: ['meta', 'ubl:Invoice'],
	$defs: {
		valueRef: {
			type: 'string',
			pattern:
				"^=(?:([^:.]+|'.+')?(?::([^.:]+)).)?([A-Z]+[1-9][0-9]*)|('.+|[^=].*)$",
		},
		sectionRef: {
			type: 'string',
			pattern: "(?:([^:.]+|'.+')?(?::([^.:]+)))",
		},
	},
} as unknown as JSONSchemaType<Mapping>;
