import { Module } from '@nestjs/common';
import { AppsModule } from './apps/apps.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [AppsModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
