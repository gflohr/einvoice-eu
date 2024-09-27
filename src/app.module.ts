import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilityModule } from './utility/utility.module';

@Module({
	imports: [UtilityModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
