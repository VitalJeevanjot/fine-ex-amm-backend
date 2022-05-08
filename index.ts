import { Queue, QueueScheduler } from 'bullmq';
import { QueueEvents } from 'bullmq';

require('dotenv').config({ path: __dirname + '/.env' })
import { setRequiredVariable } from './helpers';


const queueScheduler = new QueueScheduler('tasks', {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
});
const queue = new Queue('tasks', {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
})
const queueEvents = new QueueEvents('tasks', {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
})



async function addJobs () {
  // await queue.add(
  //   'submarine',
  //   { color: 'yellow' },
  //   {
  //     repeat: {
  //       cron: '* 15 3 * * *',
  //     },
  //   },
  // );

  // for (let index = 0; index < 100; index++) {
  // amount & price is in percentage
  await queue.add(
    'createOrder',
    {
      order_id: '',
      exchange_url: "https://apitest.fine.exchange",
      symbol: 'XHT/USDT',
      type: 'limit',
      side: 'buy',
      amount: "10",
      price: "5",
      api_key: setRequiredVariable('APIKEY'),
      api_secret: setRequiredVariable('APISECRET')
    },
    {
      delay: 5000
      // jobId: index.toString()
    }
  );
  // }
  // const repeatableJobs = await queue.getRepeatableJobs();
  // console.log(repeatableJobs)

  // for (var i = 0; i < 2; i++) {
  //   await queue.add('dataFetching', { url: 'https://www.boredapi.com/api/activity' }, {
  //     repeat: {
  //       every: 100,
  //       limit: 3
  //     },
  //     jobId: i.toString()
  //   })
  // }
}
addJobs()
var i = 0
queueEvents.on('completed', (data: any) => {
  console.log(`${data.jobId} has completed and returned`);
  console.log(data.returnvalue)
  i++
  console.log(i)
  var current = new Date();
  console.log(current)

  if (data.returnvalue.continue == true) {
    addJobs()
  } else {
    // log job discontinued and specify reason (by user or by system (intentionally or error))
  }
});





