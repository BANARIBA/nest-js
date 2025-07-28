# Ejecutar en Dev

1. Clonar el proyecto
2. Ejecutar dependencias ```npm i```
3. Generar el archivo `.env` con las variables de entorno del `.env.template`
4. Levantar la base de datos ```docker compose up -d```
5. Generar el prisma client ```npx prisma generate```
6. Ejecutar el proyecto ```npm run start:dev```

## Librerias en las que gira entorno al curso, instalar los types npm i --save-dev @types/pdfmake` instalar npm i pdfmake@0.2.17 por que la nueva da error
## o si da el error de is not a constructor ir al tsconfig.json y poner "esModuleInterop": true
[PDFMAKE](http://pdfmake.org/#/)
[HTML TO PDFMAKE](https://www.npmjs.com/package/html-to-pdfmake)
[JSDom](https://www.npmjs.com/package/jsdom)

## Si quieres sincronizar los cambios de una tabla que creaste manualmente con prisma se ejecuta ```npx prisma db pull``` y ```npx prisma generate```
## El primer comando pull sincroniza es decir si hay tablas en la bd y no en el archivo de prisma, las crea en prisma
## generate genera lo inverso lo que tengas en prisma y no en ls bd