require('dotenv').config({ path: __dirname + '/.env' })
import { setRequiredVariable } from './helpers';

import { Worker } from 'bullmq';
import ccxt from 'ccxt';
import axios from 'axios';



async function main () {
  // console.log('up!')
  // // console.log(await exchange.fetchOrderBook('XHT/USDT', 5))
  // // console.log(await exchange.has)

  // var obj: any = {
  //   urls:
  //   {
  //     api:
  //     {
  //       rest:
  //         "https://apitest.fine.exchange"
  //     }
  //   }
  // }

  // const exchange: any = new ccxt.hollaex(obj)
  // // for better make 2 workers with 2 loggins, One for 'buying' and one for 'selling'
  // exchange.apiKey = setRequiredVariable('APIKEY')
  // exchange.secret = setRequiredVariable('APISECRET')

  // var get_balance = await exchange.fetchBalance()

  // console.log(get_balance)

  // <-- ...Above Testing...-->


  const worker = new Worker('tasks', async job => {
    var obj: any = {
      urls:
      {
        api:
        {
          rest:
            job.data.exchange_url
        }
      }
    }

    const exchange: any = new ccxt.hollaex(obj)
    // for better make 2 workers with 2 loggins, One for 'buying' and one for 'selling'
    exchange.apiKey = setRequiredVariable('APIKEY')
    exchange.secret = setRequiredVariable('APISECRET')

    let get_side = job.data.side
    let get_symbol = job.data.symbol.split('/') // base/quote currency
    let get_orderbook = await exchange.fetchOrderBook(job.data.symbol, 5)
    let top_bid_ask = (get_side === 'buy') ?
      get_orderbook.bids[0][0] : get_orderbook.asks[0][0]  // price of 1st from bids : asks
    let calculate_price_spread = (get_side === 'buy') ? top_bid_ask - (top_bid_ask / 100 * 5) : top_bid_ask + (top_bid_ask / 100 * 5)
    var get_balance = await exchange.fetchBalance()
    // (for my exchange) the percentage of amount used is base currency, to buy/sell quote
    let calculated_amount = (get_balance[get_symbol[0]]['free'] / 100) * job.data.price

    let orderId = await exchange.createOrder(
      job.data.symbol,
      job.data.type,
      get_side,
      calculated_amount,
      calculate_price_spread
    )
    return orderId
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
}
main()