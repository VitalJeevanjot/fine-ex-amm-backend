import express from 'express';
import logger from './logger';
import * as queueController from './controller/serverRequestController'

const app = express();

var port = process.env.PORT || 8080;

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.get('/', queueController.say_hello)
app.post('/get_services', queueController.get_services)
app.post('/save_created_new', queueController.save_created_new)

app.listen(port, () => logger.info(`databaseHandler: Running at ${port}!`))

