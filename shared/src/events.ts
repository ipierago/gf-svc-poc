import * as amqp from 'amqplib';

let channel: amqp.Channel;

import { BuyItemEvent } from './gen/ts/backend';

const buy_item_event = 'BuyItemEvent';
const topic_exchange = 'topic_exchange';


let queueResult: amqp.Replies.AssertQueue;

export const sendBuyItemEvent = (userId: number, itemId: number, userItemId: number, correlationId: string) => {
  console.log(`sendBuyItemEvent(userId: ${userId}, itemId: ${itemId}, userItemId: ${userItemId}, correlationId: ${correlationId})`);
  const event: BuyItemEvent = { userId, itemId, userItemId, correlationId };
  const buffer = BuyItemEvent.encode(event).finish();
  const messageBuffer = Buffer.from(buffer);
  //channel.sendToQueue(queueBuyItemEvent, messageBuffer);
  channel.publish(topic_exchange, buy_item_event, messageBuffer);
}

export const subscribeBuyItemEvent = (callback: (buyItemEvent: BuyItemEvent) => void) => {
  console.log('subscribeBuyItemEvent');
  /*
  channel.consume(queueBuyItemEvent, function (msg) {
    if (msg !== null) {
      const buffer = msg.content;
      const user = BuyItemEvent.decode(buffer);
      callback(user);
      channel.ack(msg);
    }
  });
  */
  channel.consume(queueResult.queue, (msg) => {
    if (msg !== null) {
      console.log(`channel.consume [x] ${msg.fields.routingKey}: '${msg.content.toString()}'`);
      if (msg.fields.routingKey === buy_item_event) {
        const buyItemEvent = BuyItemEvent.decode(msg.content);
        callback(buyItemEvent)
      }
      channel.ack(msg);
    }
  });
}

export const initializeEvents = async (): Promise<void> => {
  const connection = await amqp.connect('amqp://rabbitmq');
  channel = await connection.createChannel();

  //await channel.assertQueue(queueBuyItemEvent);

  await channel.assertExchange(topic_exchange, 'topic', { durable: false })
  queueResult = await channel.assertQueue('', { exclusive: true });
  const bindingKeys = [buy_item_event];
  for (let key of bindingKeys) {
    channel.bindQueue(queueResult.queue, topic_exchange, key);
  }

}
