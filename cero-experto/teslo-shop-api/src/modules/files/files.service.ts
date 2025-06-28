import { join } from 'path';
import { existsSync } from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FilesService {
  public getStaticProductImage(imageName: string) {
    const imagePath = join(__dirname, '../../../static/products', imageName);
    if (!existsSync(imagePath))
      throw new NotFoundException(`Product Image ${imageName} not found!`);
    return imagePath;
  }
}
