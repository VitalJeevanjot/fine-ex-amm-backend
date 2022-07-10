import ccxt from 'ccxt';

import { setRequiredVariable } from './helpers';




export async function cancelTask (
  api_key: string, 
  api_secret: string, 
  api_url: string, 
  order_id: string
  ) {
  // for better make 2 workers with 2 loggins, One for 'buying' and one for 'selling'
  // <...Testing...> 
  var obj: any = {
    urls:
    {
      api:
      {
        rest:
          api_url
      }
    }
  }
  const exchange: any = new ccxt.hollaex(obj)
  exchange.apiKey = api_key
  exchange.secret = api_secret
  // console.log(await exchange.fetchStatus())

  return await exchange.cancelOrder(order_id)

  // console.log(await exchange.fetchAccounts())
  // console.log(await exchange.fetchOrderBook('XHT/USDT', 5))
  // console.log(await exchange.fetchOrderBook('XHT/USDT', 5))
  // console.log(await exchange.has)

  // var get_balance = await exchange.fetchBalance()

  // console.log(get_balance)

  // </...Testing...>

  // <...Testing...>
  // let orderId = await exchange.createOrder(
  //   'XHT/USDT',
  //   'limit',
  //   'buy',
  //   '10',
  //   '0.14'
  // )

  // console.log('orderID')
  // console.log(orderId)

  // let editOrder = await exchange.editOrder(
  //   orderId.id,
  //   'XHT/USDT',
  //   'limit',
  //   'buy',
  //   '10',
  //   '0.13'
  // )
  // console.log('Edited Order ID')
  // console.log(editOrder)

  // let edit_again_Order = await exchange.editOrder(
  //   editOrder.id,
  //   'XHT/USDT',
  //   'limit',
  //   'buy',
  //   '10',
  //   '0.12'
  // )
  // console.log('Edited again Order ID')
  // console.log(edit_again_Order)
  // </...Testing...>
}