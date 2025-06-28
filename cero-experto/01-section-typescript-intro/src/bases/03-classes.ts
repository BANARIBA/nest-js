import axios from 'axios';
import { Move, PokeApiResponse } from '../interfaces';

export class Pokemon {
  public readonly id: number;
  public readonly name: string;
  public readonly img: string;

  constructor(id: number, name: string, img: string) {
    this.id = id;
    this.name = name;
    this.img = img;
  }

  public get imgUrl (): string {
    return `https://pokemon.com/${this.img}`;
  }

  async getMoves (): Promise<Move[]> {
    const {data} = await axios.get<PokeApiResponse>('https://pokeapi.co/api/v2/pokemon/4');
    console.log(data.moves);
    return data.moves;
  }
}
