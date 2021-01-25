require('dotenv').config();

const {
  PORT, NODE_ENV, JWT_SECRET, DB_URL,
} = process.env;

const isProd = NODE_ENV === 'production';

const port = (isProd && PORT) ? PORT : '3000';
const jwtSecret = (isProd && JWT_SECRET) ? JWT_SECRET : 'dev-secret';
const dbUrl = (isProd && DB_URL) ? DB_URL : 'mongodb://localhost:27017/diplomadb';

module.exports = {
  PORT: port,
  JWT_SECRET: jwtSecret,
  DB_URL: dbUrl,
};
