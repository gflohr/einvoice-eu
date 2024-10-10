import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import { Response } from 'express';

@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
	constructor(private readonly invoiceService: InvoiceService) {}

	@Post('generate')
	@ApiBody({ type: GenerateInvoiceDto })
	@ApiOperation({ summary: 'Generate an Invoice' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'The generated invoice as XML',
	})
	async generate(
		@Body() generateInvoiceDto: GenerateInvoiceDto,
		@Res() res: Response,
	): Promise<void> {
		const xml = await this.invoiceService.generate(generateInvoiceDto);

		res.status(HttpStatus.OK).contentType('application/xml').send(xml);
	}
}
