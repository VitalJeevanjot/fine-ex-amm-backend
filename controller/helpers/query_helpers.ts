const { Sequelize, DataTypes, Op } = require('sequelize');
import { encryptData } from '../../helpers';
import { Tasks } from '../cli/databaseModal';
import logger from '../../logger';


export async function getUsersTasks(email: string) {
  return await Tasks.findAll({
    where: {
      taskOwnerEmail: email,
      [Op.or]: [{taskStatus: 'running'}, {taskStatus: 'stopped'}]
    }
  })
}
export async function saveNewTask(task: any, res: any) {
  var new_task
  try {
    new_task = await Tasks.create({
      taskID: task.uid,
      taskRunningServer: task.body.taskRunningServer,
      taskOwnerEmail: task.login_email,
      taskStatus:  task.body.continue ? 'running' : 'stopped',
      taskPair:  task.body.symbol,
      taskInterval: task.body.seconds_interval,
      taskAmount: task.body.seconds_interval,
      taskSpread: task.body.price,
      taskType: task.body.type,
      taskExchange: task.body.exchange_url,
      taskExchangeAPIURL: task.body.exchange_url,
      taskTotalGeneratedVolume: task.body.totalVolume,
      taskCreatedTime: task.body.timeStarted,
      taskLastStartTime: task.body.timeStarted,
      taskGeneratedVolume1HourAverage: task.body.volumeInHour,
      taskUsedWithAPIKey: task.body.api_key,
      taskUsedWithAPISecret: task.body.api_secret,
    })
    console.log(new_task)
    logger.info('databaseHandler: query_helper: saveNewTask: ' + task.login_api_apiKey_S.toString() +": new_task: " + JSON.stringify(encryptData(new_task)))
    if(new_task.id) {
      return res.status(200).send({task_id: new_task.id})
    } else {
      return res.status(500).send({message: 'create_new_database_error'})
    }
  } catch(e:any) {
    logger.info('databaseHandler: query_helper: saveNewTask: Unexpected Error: ' + req.body.body.login_api_apiKey_S.toString() + ": error_message: " + e.toString() + ": error_stack: " + e.stack)
  }
    // TASK VALUE: task.body
    //   order_id: '',
    //   exchange_url: 'https://apitest.fine.exchange',
    //   symbol: 'XHT/USDT',
    //   type: 'limit',
    //   side: 'buy',
    //   amount: '10',
    //   price: '2',
    //   api_key: 'c2b3cae2bfa7253cd5bf4ebb7152e534e874ba99',
    //   api_secret: '14414ca6fda7b727b3246d3dde7830556a3b63fe7bdbb71dab',
    //   timeStarted: 1654763974485,
    //   timeElapsed: 0,
    //   totalVolume: 0,
    //   volumeInHour: 0,
    //   volumeInEachHour: 0,
    //   task_id: '515d586a-8947-4eff-9f56-079395edfe1a',
    //   login_api_apiKey_S: 'c2b3cae2bfa7253',
    //   seconds_interval: '10',
    //   fine_exchange_user_id: 'vitalvictor1123@gmail.com'
}
