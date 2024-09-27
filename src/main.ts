import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';

async function bootstrap() {
	// Read and parse package.json
	const packageJsonPath = path.join(__dirname, '..', 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
	const majorVersion = semver.major(packageJson.version);

	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix(`api/v${majorVersion}`);

	const config = new DocumentBuilder()
		.setTitle('EInvoice EU API')
		.setDescription('Generate electronic invoices conforming to EN16931')
		.setVersion(packageJson.version)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(3000);
}
bootstrap();
