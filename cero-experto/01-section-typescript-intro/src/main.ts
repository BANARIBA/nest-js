// import { age, isActive, name } from "./bases/01-types";
// import { bulbassaur, pokemons, pokemonsIds } from './bases/02-objects';
import { PokeApiService, PokeFetchApiService } from "./api/poke-api.service";
import { Pokemon } from "./bases/04-injection";
// import { pikachu } from "./bases/05-decorators";

const pokeApiService = new PokeApiService();
const pokeFetchApiService = new PokeFetchApiService();

// VER COMO SE HICIERON ESAS PETICIONES YA QUE SE APLICA EL PRINCIPIO DE SUSTITUCION DE LISTKOV ver PokeApiHttpServices EN 04-injection.ts

//  Este se hizo con axios
export const charmander = new Pokemon(4, "Charmander", "charmander.png", pokeApiService);
charmander.getMoves();

//  Este se hizo con fetch
export const bulbassaur = new Pokemon(1, "Bulbassaur", "bulbassaur.png", pokeFetchApiService);
bulbassaur.getMoves();

// @Decorators
// console.log(pikachu.speak);