import { Worker } from 'bullmq';
import ccxt from 'ccxt';
import axios from 'axios';

console.log('running...')

console.log(ccxt.exchanges)
const worker = new Worker('tasks', async job => {
  var res: any;
  res = await axios.get(job.data.url)
  return res.data
  // console.log(job.data)
}, {
  concurrency: 10000,
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
})

var i = 0;
// worker.on('resumed', () => {
//   console.log('active!')
// })

worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`)
  var current = new Date();
  console.log(current)
})

worker.on('completed', job => {
  console.log(`${job.id} has completed`)
  i++
  console.log(i)
})