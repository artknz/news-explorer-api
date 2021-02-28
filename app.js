require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { limiter } = require('./middlewares/limits');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect('mongodb://localhost:27017/diplomadb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT, JWT_SECRET, DB_URL } = require('./configs');

console.log({ PORT, JWT_SECRET, DB_URL });

app.use(limiter);

app.use(helmet());

const allowedCors = [
  'http://artknz1.students.nomoreparties.xyz',
  'https://artknz1.students.nomoreparties.xyz',
  'http://localhost:3001',
  'http://localhost:3000',
];

app.use(cors({
  origin: allowedCors,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(requestLogger);

app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(err.statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
