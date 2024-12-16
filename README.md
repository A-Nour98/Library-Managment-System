# Library Managment System

- use `npm install` to install necessary dependencies
- provide a .env file with the following variables(db username and password are the credinetials of the local machine postgres configuration):
```
NODE_ENV=development
PORT=
DB_USERNAME=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=
DB_NAME=
DB_DIALECT = postgres
```
- run the command: `npx sequelize-cli db:create` to create the db with the specified name in the .env file
- run the command: `npx sequelize-cli db:migrate` to use the included migration files to create the tables and indexes
- run the command `npx sequelize-cli db:seed:all` to use a book seed file to insert a couple of included book table records
- run the command `node server.js` to run the server
