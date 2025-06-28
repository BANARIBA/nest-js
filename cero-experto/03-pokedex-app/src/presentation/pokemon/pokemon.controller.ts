import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes';
import { PaginationDto } from 'src/common/dtos';

@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() paginationDto: PaginationDto) {
    // console.log(paginationDto)
    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':term')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  @Patch(':term')
  @HttpCode(HttpStatus.OK)
  update(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(term, updatePokemonDto);
  }

  @Delete(':pokemonId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('pokemonId', ParseMongoIdPipe) pokemonId: string) {
    // return {pokemonId}
    return this.pokemonService.remove(pokemonId);
  }
}
