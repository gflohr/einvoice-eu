/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MappingService } from './mapping/mapping.service';

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService, MappingService],
})
export class AppModule {}
