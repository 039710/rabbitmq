const amqp = require('amqplib');

class RabbitMQProducer {
  constructor(connectionUrl, exchangeName) {
    this.connectionUrl = connectionUrl;
    this.exchangeName = exchangeName;
  }

  async sendMessage(routingKey, message) {
    // create a connection to RabbitMQ server
    const conn = await amqp.connect(this.connectionUrl);

    // create a channel to communicate over
    const ch = await conn.createChannel();

    // assert the exchange
    await ch.assertExchange(this.exchangeName, 'direct', { durable: true });

    // send the message to the exchange
    ch.publish(this.exchangeName, routingKey, Buffer.from(message));

    // close the channel and connection
    await ch.close();
  }
}

module.exports = RabbitMQProducer;