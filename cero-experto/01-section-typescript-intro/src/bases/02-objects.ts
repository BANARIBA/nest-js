interface Pokemon {
  id: number;
  name: string;
  age?: number;
}
export const pokemonsIds: number[] = [1,20,25,30,35,55,44];
export const bulbassaur: Pokemon = {
  id: 1,
  name: 'Bulbassaur',
  age: 30,
};
export const charmander: Pokemon = {
  id: 2,
  name: 'Charmander',
  age: 3,
};
export const pokemons: Pokemon[] = [
  bulbassaur,
  charmander,
];