import express from 'express';
import logger from './logger';
import * as queueController from './controller/queueController'

const app = express();

var port = process.env.PORT || 3000;

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', queueController.my_services)
app.get('/my_services', queueController.my_services)
app.post('/create_new', queueController.create_new)

app.listen(port, () => logger.info(`Running at ${port}!`))