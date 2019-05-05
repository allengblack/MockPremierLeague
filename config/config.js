require('dotenv').config();

module.exports = {
  "development": {
    "dialect": process.env.DB_DIALECT,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST
  },
  "test": {
    "dialect": process.env.DB_DIALECT,
    "username": "root",
    "password": "admin",
    "database": "mockpremierleague_test",
    "host": "127.0.0.1"
  },
  "production": {
    "dialect": process.env.DB_DIALECT,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST
  }
}