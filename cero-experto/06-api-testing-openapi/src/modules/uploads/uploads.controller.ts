import { Controller, Post } from '@nestjs/common';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('upload-photo')
  onUploadPhoto () {
    
  }
}
