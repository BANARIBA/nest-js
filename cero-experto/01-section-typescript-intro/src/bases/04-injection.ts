import { PokeApiHttpServices } from '../api/poke-api.service';
import { PokeApiResponse } from '../interfaces';

export class Pokemon {
  public readonly id: number;
  public readonly name: string;
  public readonly img: string;

  constructor(id: number, name: string, img: string, private readonly pokeApiService: PokeApiHttpServices) {
    this.id = id;
    this.name = name;
    this.img = img;
  }

  public get upperName (): string {
    return this.name.toUpperCase();
  }

  public get speak (): string {
    return `${this.name.toUpperCase()} ${this.name.toUpperCase()} is speaking!`;
  }

  public get imgUrl (): string {
    return `https://pokemon.com/${this.img}`;
  }

  async getMoves () {
    const data = await this.pokeApiService.get<PokeApiResponse>(`https://pokeapi.co/api/v2/pokemon/${this.id}`);
    console.log(data.moves[0]);
    return data.moves;
  }
}
