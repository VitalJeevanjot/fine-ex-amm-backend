import { Request, Response } from 'express';
import axios from 'axios'
import { setRequiredVariable, getUserDetails, encryptData } from '../helpers';
import logger from '../logger';
import { getUsersTasks, saveNewTask } from './helpers/query_helpers';
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
    console.log('...listing tasks...')
    console.log(tasks)
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
    logger.info("databaseHandler: create_new: " + req.body.body.login_api_apiKey_S.toString() +": " + encryptData(JSON.stringify(req.body)))
    return saveNewTask(req.body, res)
  } catch (e: any) {
    console.log(e)
    logger.info('databaseHandler: Unexpected Error: ' + req.body.body.login_api_apiKey_S.toString() +": " + e.stack.toString())
    if(res.headersSent) {
      return
    }
    return res.status(500).json({
      'message': 'Unexpected error'
    })
  }
}


export {
  get_services,
  save_created_new,
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