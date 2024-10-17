/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { MappingService } from './mapping/mapping.service';
import { MappingModule } from './mapping/mapping.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ValidationModule } from './validation/validation.module';

@Module({
	imports: [MappingModule, InvoiceModule, ValidationModule],
	providers: [MappingService],
})
export class AppModule {}
