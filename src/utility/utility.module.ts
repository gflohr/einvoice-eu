import { Module } from '@nestjs/common';
import { DateParserService } from './date-parser.service';

@Module({
	providers: [DateParserService],
})
export class UtilityModule {}
