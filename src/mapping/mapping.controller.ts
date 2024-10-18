import { BadRequestException, Controller, Get, NotFoundException, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MappingService } from './mapping.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('mapping') // Tag for Swagger
@Controller('mapping') // Base path for this controller
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

	@Post('transform/:mappingId')
	@ApiParam({
		name: 'mappingId',
		description: 'The ID of the mapping to apply.',
		required: true,
	})
	@ApiQuery({
		name: 'format',
		description: 'One of the supported e-invoice formats unless ubl:Invoice/cbc:CustomizationID is given.',
		required: false,
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'The spreadsheet to be transformed.',
		required: true,
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: 'Transformation successful',
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request with error details',
	})
	@ApiResponse({
		status: 404,
		description: 'Mapping ID not found',
	})
	@UseInterceptors(FileInterceptor('file'))
	async transformMapping(
		@Param('mappingId') mappingId: string,
		@Query('format') format: string,
		@UploadedFile() file: Express.Multer.File,
	) {
		try {
			return await this.mappingService.transform(mappingId, file, format);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new BadRequestException({
				message: 'Transformation failed.',
				details: error,
			});
		}
	}
}
