import { Request, Response } from 'express';
import axios from 'axios'
import { setRequiredVariable, getUserDetails, encryptData } from '../helpers';
import logger from '../logger';
import { getUsersTasks, saveNewTask, deleteTask, getTaskById, udpateOrderId } from './helpers/query_helpers';
// import { QuickDB } from 'quick.db';
// const db = QuickDB({ filePath: 'db/main.sqlite' });

// var user_task_control = new db.table('user_task_control')

const hello = async (req: Request, res: Response) => {
  return res.status(200).send("Hello")
}

const get_services = async (req: Request, res: Response) => {
  try {
    logger.info('\n\n')
    
    console.log(req.body)
    logger.info("databaseHandler: get_services: " + req.body.logger_Key +": " + encryptData(JSON.stringify(req.body)))
    var tasks: any = await getUsersTasks(req.body.email)
    // console.log('...listing tasks...')
    // console.log(tasks)
    // ...listing tasks...
    // []
    // above 2 console log lines and their results
    logger.info("databaseHandler: get_services: user_tasks: " + req.body.logger_Key +": " + encryptData(tasks.toString()))
    return res.status(200).send({tasks: tasks, logger_key: req.body.logger_Key})
  } catch (e: any) {
    logger.info('databaseHandler: Unexpected Error: ' + req.body.logger_Key +": " + e.message + ": " +e.stack.toString())
    if(res.headersSent) {
      return
    }
    return res.status(500).json({
      'message': 'Unexpected error'
    })
  }

}


const save_created_new = async (req: Request, res: Response) => {
  try {

    // let add_jobs = addJobs(req.body)
    // console.log("req.body>")
    // console.log(req.body)
    // console.log("<req.body")
    logger.info("databaseHandler: save_task: " + req.body.body.login_api_apiKey_S.toString() +": " + encryptData(JSON.stringify(req.body)))
    return saveNewTask(req.body, res)
  } catch (e: any) {
    console.log(e)
    logger.info('databaseHandler: save_task: Unexpected Error: ' + req.body.body.login_api_apiKey_S.toString() +": " + e.stack.toString())
    if(res.headersSent) {
      return
    }
    return res.status(500).json({
      'message': 'S_t_: Unexpected error'
    })
  }
}


const get_task_by_id = async (req: Request, res: Response) => {
  try {

    // let add_jobs = addJobs(req.body)
    // console.log("req.body>")
    // console.log(req.body)
    // console.log("<req.body")
    logger.info("databaseHandler: get_task_by_id: " + req.body.login_api_apiKey_S +": " + encryptData(JSON.stringify(req.body)))
    res.status(200).send({task: await getTaskById(req.body.id)})
  } catch (e: any) {
    console.log(e)
    logger.info('databaseHandler: get_task_by_id: Unexpected Error: ' + req.body.body.login_api_apiKey_S.toString() +": " + e.stack.toString())
    if(res.headersSent) {
      return
    }
    return res.status(500).json({
      'message': 't_b_i_: Unexpected error'
    })
  }
}

const delete_service = async (req: Request, res: Response) => {
  try {
    logger.info("databaseHandler: delete_service: " + req.body.login_api_apiKey_S.toString() +": " + encryptData(JSON.stringify(req.body)))
    let _res = await deleteTask(req.body, req.body.status)
    if(_res == "status_update_error") {
      return res.status(200).send({message: "<span class='text-red'>Error at Deleting: </span>" + req.body.id, logger_key: req.body.login_api_apiKey_S.toString()})
    } else if(_res == "get_task_error") {
      return res.status(200).send({message: "<span class='text-red'>Error before Deleting! </span>" + req.body.id, logger_key: req.body.login_api_apiKey_S.toString()})
    } else if(_res == "cancel_order_error") {
      return res.status(200).send({message: "<span class='text-red'>Task Deleted! But error while Order cancellation from exchange: </span>" + req.body.id, logger_key: req.body.login_api_apiKey_S.toString()})
    }
    if(!res.headersSent) {
      return res.status(200).send({message: "<span class='text-red'>Deleted: </span>" + req.body.id, logger_key: req.body.login_api_apiKey_S.toString()})
    }
  } catch (e: any) {
    console.log(e)
    logger.info('databaseHandler: delete_service: Unexpected Error: ' + req.body.login_api_apiKey_S.toString() +": " + e.stack.toString())
    if(res.headersSent) {
      return
    }
    return res.status(500).json({
      'message': 'd_t_: Unexpected error'
    })
  }
}

const update_order_id = async (req: Request, res: Response) => {
  try {
    logger.info("databaseHandler: update_order_id: " + req.body.login_api_apiKey_S.toString() +": " + encryptData(JSON.stringify(req.body)))
    await udpateOrderId(req.body, req.body.order_id)
    return res.status(200).send({message: "order id updated to: " + req.body.order_id, logger_key: req.body.login_api_apiKey_S.toString()})
  } catch (e: any) {
    console.log(e)
    logger.info('databaseHandler: update_order_id: Unexpected Error: ' + req.body.login_api_apiKey_S.toString() +": " + e.stack.toString())
    if(res.headersSent) {
      return
    }
    return res.status(500).json({
      'message': 'd_t_: Unexpected error'
    })
  }
}


export {
  get_services,
  save_created_new,
  delete_service,
  update_order_id,
  get_task_by_id,
  hello
}


// Testing...

// function testRun() {
//   var constructPostObj = {
//     api_key: setRequiredVariable('APIKEY'),
//     api_secret: setRequiredVariable('APISECRET'),
//     api_url: setRequiredVariable('APIURL')
//   }
//   axios.post("http://localhost:3000/create_new", {
//         body: constructPostObj
//   }).then((res: any) => {
//     console.log(res.data)
//   }).catch((e: any) => {
//     console.log(e.response.data)
//     console.log(e.message)
//   })
// }
// testRun()