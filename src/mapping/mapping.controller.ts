import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MappingService } from './mapping.service';

@ApiTags('mappings') // Tag for Swagger
@Controller('mappings') // Base path for this controller
export class MappingController {
	constructor(private readonly mappingService: MappingService) {}

	@Get('list')
	@ApiResponse({
		status: 200,
		description: 'get a list of all valid mapping IDs',
		type: [String],
	})
	async list(): Promise<string[]> {
		return this.mappingService.list();
	}
}
