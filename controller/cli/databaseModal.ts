const { Sequelize, DataTypes } = require('sequelize');
import { setRequiredVariable } from '../../helpers';

const sequelize = new Sequelize(`postgres://${setRequiredVariable('USER_NAME')}:${setRequiredVariable('USER_PASSWORD')}@${setRequiredVariable('DB_URL')}:${setRequiredVariable('DB_PORT')}/${setRequiredVariable('DB_NAME_TASKS')}`)


async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}


export const User_Tasks = sequelize.define('Users_Tasks', {
  userEmail: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userExchangeId: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  totalTasksUser: {
    type: DataTypes.BIGINT
  },
  totalVolumeByTasks: {
    type: DataTypes.BIGINT
  },
  lastUserTask: {
    type: DataTypes.TEXT
  },
  lastUserTaskCreatedDate: {
    type: DataTypes.DATE
  }
});

export const Tasks = sequelize.define('Tasks', {
  taskID: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskRunningServer: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskOwnerEmail: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskStatus: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskPair: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskInterval: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  taskAmount: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  taskSpread: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  taskType: { // limit
    type: DataTypes.STRING,
    allowNull: false
  },
  taskSide: { // New -> buy/sell
    type: DataTypes.STRING,
    allowNull: false
  },
  taskExchangeLoginURL: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskExchangeAPIURL: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskExchangeAPIName: { // New, Name of api in front-end
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskTotalGeneratedVolume: {
    type: DataTypes.BIGINT
  },
  taskCreatedTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  taskLastStartTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  taskGeneratedVolume1HourAverage: {
    type: DataTypes.BIGINT
  },
  taskUsedWithAPIKey: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskUsedWithAPISecret: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskRecentOrderId: {
    type: DataTypes.TEXT
  },
});
// DONE: here set both taskUsedWithAPIKey & taskUsedWithAPISecret encrypted with a key from okteto servers


export const TaskStatus = sequelize.define('Tasks_position', {
  UUID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  taskID: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskOwnerEmail: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskStatusChanged: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taskStatusChangedTime: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});


// Should run one time only...
// syncModal()
export async function syncModal() {
  await sequelize.sync();
  // await sequelize.sync({force: true});
}
