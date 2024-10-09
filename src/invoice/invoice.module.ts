/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';

@Module({
	providers: [InvoiceService],
	controllers: [InvoiceController],
})
export class InvoiceModule {}
