/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { MappingService } from './mapping/mapping.service';
import { MappingModule } from './mapping/mapping.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
	imports: [MappingModule, InvoiceModule],
	providers: [MappingService],
})
export class AppModule {}
