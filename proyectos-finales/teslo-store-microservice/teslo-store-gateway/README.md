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
- (Multer)[https://docs.nestjs.com/techniques/file-upload]
```npm i -D @types/multer```
```npm i multer```

# How to connect the gateway with a microservice
- Install ```npm i --save @nestjs/microservices```
- Go to the module api file by example __src/apps/products-api/products-api.module.ts__ and paste this on imports
```ts
  imports: [
   ClientsModule.registerAsync([
      {
        name: PRODUCT_API_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP, // SAME TRANSPORT THAT THE MICROSERVICE
          options: {
            host:
              configService.get<string>('PRODUCTS_MS_HOST') ??
              'localhost',

            port: Number(
              configService.get<string>('PRODUCTS_MS_PORT') ??
              3001,
            ),
          },
        }),
      },
    ]),
  ],
```