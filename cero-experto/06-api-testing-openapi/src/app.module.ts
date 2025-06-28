import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ModulesModule } from './modules/modules.module';
import { MongooseModule } from '@nestjs/mongoose';
import { environmentVariables } from './core/config';

@Module({
  imports: [
    MongooseModule.forRoot(environmentVariables.mongoUrlConnection),
    CoreModule, 
    ModulesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
