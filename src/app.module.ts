/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MappingService } from './mapping/mapping.service';
import { MappingModule } from './mapping/mapping.module';

@Module({
	imports: [MappingModule],
	controllers: [AppController],
	providers: [AppService, MappingService],
})
export class AppModule {}
