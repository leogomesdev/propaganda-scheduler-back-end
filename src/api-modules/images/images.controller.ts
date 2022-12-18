import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongodb';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { Image } from './entities/image.entity';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';

@Controller({
  path: 'images',
  version: '1',
})
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  //@ApiConsumes('multipart/form-data')
  //@ApiImplicitFile({ name: 'file', required: true })
  create(
    @Body() createImageDto: CreateImageDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: RegExp('image/jpeg|image/png') }),
        ],
      }),
    )
    file: Express.Multer.File = null,
  ): Promise<Image> {
    return this.imagesService.create(createImageDto, file);
  }

  @Get()
  findAll(): Promise<Image[]> {
    return this.imagesService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id', ParseObjectIdPipe) _id: ObjectId): Promise<Image> {
    return this.imagesService.findOne(_id);
  }

  @Delete(':_id')
  remove(@Param('_id', ParseObjectIdPipe) _id: ObjectId): Promise<void> {
    return this.imagesService.remove(_id);
  }
}