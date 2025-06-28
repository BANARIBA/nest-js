import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [BookModule, AuthModule, UploadsModule]
})
export class ModulesModule {}
