const { Sequelize, DataTypes, Op } = require('sequelize');
import { decryptData, encryptData } from '../../helpers';
import { Tasks } from '../cli/databaseModal';
import logger from '../../logger';
import { cancelTask } from '../../exchange';


export async function getUsersTasks(email: string) {
  return await Tasks.findAll({
    attributes: { exclude: [
      'id', 
      'taskExchangeLoginURL', 
      'taskExchangeAPIURL', 
      'taskGeneratedVolume1HourAverage',
      'taskLastStartTime',
      'taskOwnerEmail',
      'taskRecentOrderId',
      'taskRunningServer',
      'taskTotalGeneratedVolume',
      'taskUsedWithAPIKey',
      'taskUsedWithAPISecret',
      'updatedAt'
    ] },
    where: {
      taskOwnerEmail: email,
      [Op.or]: [{taskStatus: 'running'}, {taskStatus: 'stopped'}]
    }
  })
}

export async function saveNewTask(task: any, res: any) {
  // console.log("task>")
  // console.log(task)
  // console.log("<task")
  var new_task
  try {
    new_task = await Tasks.create({
      taskID: task.uid,
      taskRunningServer: task.body.taskRunningServer,
      taskOwnerEmail: task.login_email,
      taskStatus:  task.body.continue ? 'running' : 'stopped',
      taskPair:  task.body.symbol.value,
      taskInterval: task.body.seconds_interval,
      taskAmount: task.body.amount,
      taskSpread: task.body.spread_percentage,
      taskType: task.body.type,
      taskSide: task.body.side, // New
      taskExchangeLoginURL: task.body.login_api_exchangeURL,
      taskExchangeAPIURL: task.body.api_url,
      taskExchangeAPIName: task.body.api_name, // New
      taskTotalGeneratedVolume: task.body.totalVolume,
      taskCreatedTime: Date.now(),
      taskLastStartTime: Date.now(),
      taskGeneratedVolume1HourAverage: task.body.volumeInHour,
      taskUsedWithAPIKey: encryptData(task.body.api_key),
      taskUsedWithAPISecret: encryptData(task.body.api_secret),
      taskRecentOrderId: ''
    })
    console.log("new_task>")
    console.log(new_task)
    console.log("<new_task")
    logger.info('databaseHandler: query_helper: saveNewTask: ' + task.body.login_api_apiKey_S.toString() +": new_task: " + JSON.stringify(encryptData(new_task)))
    if(new_task.id) {
      return res.status(200).send({task_id: new_task.id})
    } else {
      return res.status(500).send({message: 'create_new_database_error: 1'})
    }
  } catch(e:any) {
    logger.info('databaseHandler: query_helper: saveNewTask: Unexpected Error: ' + task.login_api_apiKey_S + ": error_stack: " + e.stack + ": e_toString: " + e.toString())
    return res.status(500).send({message: 'create_new_database_error: 2'})
  }
    // TASK VALUE: task.body {
    //   login_api_apiKey_S: 'c2b3cae2bfa7253',
    //   login_api_apiKey: 'c2b3cae2bfa7253295ea47172a21a41353e1b8d5d2f6dc43104d06ff1b2e02296506a49da509da1e009b8bd958ec399ede9dedcd723ad722526a9fc66feabfb074817a3b21321e1d35a66fdf3c32060ebc30db254abfc2c2fc2313c9ff06d89d6701b373bb5f094607fe72875053846eed78fbbe4ac51282d7a3bdfcb083746abc1a1b01e6bc9720abf8fca6ecf212e',
    //   login_api_secretKey: 'd75b9edf709b50aa71a1a435b0797a56f9a4dd5e50f186c84789f722f9dc9c71ee642b3ad58ce425bf7a6a8a26cd9eac21ad14b2b451cdf0e4f13b0aa50f827b6114f3607889209db1e8b8339bd3bbabd69939ff08cfad2d8e18b326313b7e8c7b850ec32cfb6e226a9e3cc9220dbf88e67d485c04671e4008a5fe70e88548740f73f9fc32f0a8f806827f01a110ffe3bddd',
    //   login_api_exchangeURL: 'https://apitest.fine.exchange',
    //   api_url: 'https://apitest.fine.exchange',
    //   api_key: 'c2b3cae2bfa7253cd5bf4ebb7152e534e874ba99',
    //   api_secret: '14414ca6fda7b727b3246d3dde7830556a3b63fe7bdbb71dab',
    //   side: 'buy',
    //   symbol: { label: 'XHT/USDT', value: 'XHT/USDT' },
    //   type: 'limit',
    //   seconds_interval: '10',
    //   spread_percentage: '2',
    //   amount: '20',
    //   task_uuid: '05ee8187-828b-43cd-9bc4-4c9da46cf72b'
    // },
    // login_email: 'vitalvictor1123@gmail.com',
    // api_email: 'vitalvictor1123@gmail.com'
}


export async function deleteTask(task: any, status: any) {
  let task_from_id : any
  try {
    logger.info('databaseHandler: query_helper: deleteTask: after_status_update: fetch_task_by_id: ' + task.login_api_apiKey_S + ": task:" + encryptData(JSON.stringify(task)))
    task_from_id = await getTaskById(task.id)
  } catch(e: any) {
    logger.info('databaseHandler: query_helper: deleteTask: after_status_update: fetch_task_by_id: Error: ' + task.login_api_apiKey_S + ": error_stack: " + e.stack + ": e_toString: " + e.toString())
    return "get_task_error"
  }
  
  let api_key : any = decryptData(task_from_id.taskUsedWithAPIKey)
  let api_secret : any = decryptData(task_from_id.taskUsedWithAPISecret)
  let api_url : any = task_from_id.taskExchangeAPIURL
  let recent_order_id : any = task_from_id.taskRecentOrderId
  let old_task_status: any = task_from_id.taskStatus

  try {
    logger.info('databaseHandler: query_helper: deleteTask: status_update: ' + task.login_api_apiKey_S + ": task:" + encryptData(JSON.stringify(task)))
    await Tasks.update({
        taskStatus: status,
      },
      {
        where: {
          taskID: task.id
        }
      })  
  } catch(e: any) {
    logger.info('databaseHandler: query_helper: deleteTask: status_update: Error: ' + task.login_api_apiKey_S + ": error_stack: " + e.stack + ": e_toString: " + e.toString())
    return "status_update_error"
  }

  if(old_task_status == 'running') {
    // handling if already stopped task wants to be deleted then this wont run saving an error
    // will throw error if an order is deleted by the user from exchange that was made by fine exchange AOM (Automatic order manager / this app)
    try {
      logger.info('databaseHandler: query_helper: deleteTask: cancel_order: ' + task.login_api_apiKey_S)
      console.log(await cancelTask(api_key, api_secret, api_url, recent_order_id))
    } catch(e: any) {
      logger.info('databaseHandler: query_helper: deleteTask: cancel_order: Error: ' + task.login_api_apiKey_S + ": error_stack: " + e.stack + ": e_toString: " + e.toString())
      return "cancel_order_error"
    }
  }
  
}

export async function udpateOrderId(task: any, order_id: any) {
  await Tasks.update({
    taskRecentOrderId: order_id,
  },
    {
      where: {
        taskID: task.id
      }
    })
}

export async function getTaskById(id: any) {
  return await Tasks.findOne(
    {
      where: {
        taskID: id
      }
    })
}
