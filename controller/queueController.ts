import { Request, Response } from 'express';
import logger from '../logger';


const my_services = async (req: Request, res: Response) => {
  try {
    console.log('services')
    logger.info("my_services: " + JSON.stringify(req.body))
    return res.status(200).send('data')
  } catch (e: any) {
    logger.error('Unexpected Error: ' + e.toString())
    return res.status(500).json({
      'message': 'Unexpected error'
    })
  }

}
const create_new = async (req: Request, res: Response) => {
  try {
    logger.info("create_new: " + JSON.stringify(req.body))
    return res.status(200).send('data')
  } catch (e: any) {
    logger.error('Unexpected Error: ' + e.toString())
    return res.status(500).json({
      'message': 'Unexpected error'
    })
  }
}
export {
  my_services,
  create_new
}