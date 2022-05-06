import { Worker } from 'bullmq';
import axios from 'axios'

console.log('running...')
const worker = new Worker('tasks', async job => {
  var res: any;
  res = await axios.get(job.data.url)
  return res.data
}, {
  concurrency: 100,
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
})

worker.on('resumed', () => {
  console.log('active!')
})

worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`)
  var current = new Date();
  console.log(current)
})

worker.on('completed', job => {
  console.log(`${job.id} has completed`)
})