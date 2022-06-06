const { Sequelize, DataTypes, Op } = require('sequelize');
import { setRequiredVariable, getUserDetails } from '../../helpers';
import { User_Tasks, Tasks } from '../cli/databaseModal';


export async function getUsersTasks(email: string) {
  return await Tasks.findAll({
    where: {
      userEmail: email,
      [Op.or]: [{taskStatus: 'running'}, {taskStatus: 'stopped'}]
    }
  })

}
