const { Model, knexSnakeCaseMappers } = require("objection");

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'dialer',
        password: 'Dialer@123',
        database: 'asteriskcdrdb'
    }
    ,
    pool: {
        min: 10,
        max: 20
    },
    ...knexSnakeCaseMappers(),
});
Model.knex(knex);
module.exports = knex
