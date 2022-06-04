const { Sequelize, DataTypes } = require('sequelize');
import { setRequiredVariable, getUserDetails } from '../../helpers';
import { User_Tasks, Tasks } from '../cli/databaseModal';


export async function getUsersTasks() {
  var user_detail = getUserDetails()
  const {count, rows} = await Tasks.findAndCountAll({
    where: {

    }
  })
}
