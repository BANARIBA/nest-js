<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Steps to run this microservice
0. Clone or download this repository
1. In this project copy the __.env.template__ file and paste with __.env__ name
2. Set the environment vars in __.env__
3. Install dependencies with ```npm i```
4. Run this project ```npm run start:dev```

# Instalations
- (Validators & Transformer)[https://docs.nestjs.com/techniques/validation]
```npm i --save class-validator class-transformer```
- (Environment Variables Config)[https://docs.nestjs.com/techniques/configuration]
```npm i --save @nestjs/config```
- (TypeORM with PostgreSQL)[https://docs.nestjs.com/techniques/database]
```npm install --save @nestjs/typeorm typeorm pg```

# Trasnform web service to microservice
- Install ```npm i --save @nestjs/microservices```
- Go to __main.ts__ and set
 ```ts
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.TCP,
        options: {
          port: +(process.env.PORT || 3002),
        },
      },
    );
 ```
