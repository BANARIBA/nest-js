import { join } from 'node:path';
import { Module } from '@nestjs/common';

import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedModule } from './seed/seed.module';
import { EnvVarConfig, joiValidationSchema } from 'src/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // load: [EnvVarConfig],
      validationSchema: joiValidationSchema,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'),
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI,
      {
        dbName: process.env.MONGODB_DATABASE
      }
    ),
    PokemonModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
