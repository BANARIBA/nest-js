import { Injectable } from '@nestjs/common';
import { PokemonResponse } from './interfaces';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  

  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed(quantity: number = 5) {
    await this.deletePokemons();
    const data = await this.http.get<PokemonResponse>(`https://pokeapi.co/api/v2/pokemon?limit=${quantity}`);
    const pokemonsToInsert: {name: string, no: number}[] = [];
    data.results.forEach(pokemon => {
      const segments = pokemon.url.split('/');
      const no: number = +segments[segments.length - 2];
      pokemonsToInsert.push({name: pokemon.name, no: no});
    });
    await this.pokemonModel.insertMany(pokemonsToInsert);
    return {data: "All Pokemons loaded!"};
  }

  async deletePokemons () {
    await this.pokemonModel.deleteMany();
  }
}
