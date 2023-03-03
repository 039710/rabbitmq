const amqp = require('amqplib');

class RabbitMQConsumer {
  constructor(connectionUrl, exchangeName, queueName, routingKey, handleMessage) {
    this.connectionUrl = connectionUrl;
    this.exchangeName = exchangeName;
    this.queueName = queueName;
    this.routingKey = routingKey;
    this.handleMessage = handleMessage;
  }

  async start() {
    // create a connection to RabbitMQ server
    const conn = await amqp.connect(this.connectionUrl);
    // create a channel to communicate over
    const ch = await conn.createChannel();
    // assert the exchange
    await ch.assertExchange(this.exchangeName, 'direct', { durable: true });
    // assert the queue
    await ch.assertQueue(this.queueName, { durable: true });

    ch.prefetch(1)
    // bind the queue to the exchange with the specified routing key
    await ch.bindQueue(this.queueName, this.exchangeName, this.routingKey);
    // start consuming messages
    ch.consume(this.queueName, async (msg) => {
      try {
        // parse the message body as a string
        const message = msg.content.toString();
        setTimeout(async () => {
          const isSuccess = await this.handleMessage[this.routingKey](msg);
          if (isSuccess) {
            ch.ack(msg);
            console.log(`Message processed successfully: ${message}`);
          } else {
            ch.reject(msg, true);
            console.log(`Failed to process message: ${message}`);
          }
        }, 1000);
      } catch (error) {
        ch.reject(msg, true);
      } 
    });
  }
}

module.exports = RabbitMQConsumer;