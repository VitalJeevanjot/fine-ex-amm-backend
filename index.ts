import { Queue, QueueScheduler } from 'bullmq';
import { QueueEvents } from 'bullmq';


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

  for (let index = 0; index < 10; index++) {
    await queue.add(
      'fetch',
      { url: 'https://www.boredapi.com/api/activity' },
      {
        repeat: {
          every: 10000,
          limit: 3
        }
      }
    );

  }
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

queueEvents.on('completed', (data: any) => {
  console.log(`${data.jobId} has completed and returned`);
  console.log(data.returnvalue)
  var current = new Date();
  console.log(current)
});





