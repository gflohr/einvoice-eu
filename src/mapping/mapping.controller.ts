import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import {
	ApiBody,
	ApiConsumes,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { MappingService } from './mapping.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('mapping')
@Controller('mapping')
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
		@UploadedFile() file: Express.Multer.File,
	) {
		try {
			return await this.mappingService.transform(mappingId, file);
		} catch (error) {
			if (error.code && error.code === 'ENOENT') {
				throw new NotFoundException();
			}

			throw new BadRequestException({
				message: 'Transformation failed.',
				details: error,
			});
		}
	}
}
