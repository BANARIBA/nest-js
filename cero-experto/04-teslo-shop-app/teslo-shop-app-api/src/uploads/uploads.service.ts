import { join } from 'node:path';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { handleExceptions } from 'src/config';
import { existsSync } from 'node:fs';

@Injectable()
export class UploadsService {

  getStaticProductImage (fileName: string) {
    try {
      const path = join(__dirname, '../../static/products/', fileName);
      //console.log({path})
      if (!existsSync(path)) throw new HttpException(`File ${fileName} not found`, HttpStatus.NOT_FOUND);
      return path;
    } catch (error) {
      handleExceptions(error);
    }
  }
}
