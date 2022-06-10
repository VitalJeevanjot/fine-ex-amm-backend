const { Sequelize, DataTypes, Op } = require('sequelize');
import { setRequiredVariable, getUserDetails } from '../../helpers';
import { User_Tasks, Tasks } from '../cli/databaseModal';


export async function getUsersTasks(email: string) {
  return await Tasks.findAll({
    where: {
      taskOwnerEmail: email,
      [Op.or]: [{taskStatus: 'running'}, {taskStatus: 'stopped'}]
    }
  })
}
export async function saveNewTask(task: any) {
  await Tasks.create({
    taskID: task.body.task_id
  })
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
    //   email: 'vitalvictor1123@gmail.com'
}
