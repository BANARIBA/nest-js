import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { HttpModule } from '@nestjs/axios';
import { PokemonModule } from '../pokemon/pokemon.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    HttpModule, 
    PokemonModule,
    CommonModule,
  ],
  controllers: [
    SeedController,
  ],
  providers: [
    SeedService
  ],
})
export class SeedModule {}
