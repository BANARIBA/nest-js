# POKEDEX API

## Used Stack
* MongoDB
* NestJS

1. Install nestjs: ```npm i -g @nestjs/cli```
2. Clone repository
3. Install dependencies: ```npm i```
4. Clone file __.env.template__ and rename the copy to __.env__ after that, set the values
5. Run Docker DB container: ```docker compose up -d```
6. Start App: ```npm run start:dev```
7. Run seed to create pokemon mock data: ```localhost:3500/api/seeds/:quantity```, ```:quantity``` is a number of pokemons that you want to insert

## For dockerized app (PRODUCTION BUILD)
1. Create env prod file ```.env.prod```
2. Set all variables in __.env.prod__
3. Create new image ```docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build```
4. Use this command if the image already created```docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d```