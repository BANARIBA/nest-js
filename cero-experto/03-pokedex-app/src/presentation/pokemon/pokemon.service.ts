import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dtos';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private readonly defaultLimit: number;

  constructor (
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.getOrThrow<number>('DEFAULT_LIMIT');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      return await this.pokemonModel.create(createPokemonDto);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit = this.defaultLimit, offset = 0} = paginationDto;
    try {
      const [pokemons, totalPokemons]  = await Promise.all([
        this.pokemonModel.find().limit(limit).skip(limit * offset),
        this.pokemonModel.countDocuments(),
      ]);
      return {
        data: pokemons,
        totalRecors: totalPokemons,
      }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) { // Busca por no
      pokemon = await this.pokemonModel.findOne({no: term});
    } 
    
    if (!pokemon && isValidObjectId(term)) { // Busca por _id
      pokemon = await this.pokemonModel.findOne({_id: term});
    }

    if (!pokemon) { // Busca por name
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase()});
    }

    if (!pokemon) throw new HttpException(`Pokemon with: id, name, no ${term} not found`, HttpStatus.BAD_REQUEST);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);
      await pokemon.updateOne({...updatePokemonDto}, {new: true});
      return {
        ...pokemon.toJSON(),
        ...updatePokemonDto,
      }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(pokemonId: string) {
    try {
      // const pokemon = await this.findOne(pokemonId);
      // await pokemon.deleteOne();
      const {deletedCount} = await this.pokemonModel.deleteOne({_id: pokemonId});
      if (deletedCount === 0) throw new HttpException(`The pokemon was not deleted`, HttpStatus.BAD_REQUEST);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions (error: any) {
    if (error instanceof HttpException) throw error;
    if (error.code === 11000) throw new HttpException(`Pokemon Name or No already exists in other records`, HttpStatus.BAD_REQUEST);
    throw new HttpException(`Sometime went wrong in pokemon service: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
