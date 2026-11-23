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
