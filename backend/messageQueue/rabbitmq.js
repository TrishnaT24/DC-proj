// backend/messageQueue/rabbitmq.js
const amqp = require('amqplib');

let connection = null;
let channel = null;

// RabbitMQ connection details
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const TASK_EXCHANGE = 'task_events';
const TASK_CREATED_QUEUE = 'task_created';
const TASK_UPDATED_QUEUE = 'task_updated';

// Connect to RabbitMQ server
async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Create exchange
    await channel.assertExchange(TASK_EXCHANGE, 'direct', { durable: true });
    
    // Create queues
    await channel.assertQueue(TASK_CREATED_QUEUE, { durable: true });
    await channel.assertQueue(TASK_UPDATED_QUEUE, { durable: true });
    
    // Bind queues to exchange
    await channel.bindQueue(TASK_CREATED_QUEUE, TASK_EXCHANGE, 'task.created');
    await channel.bindQueue(TASK_UPDATED_QUEUE, TASK_EXCHANGE, 'task.updated');
    
    console.log('Connected to RabbitMQ');
    return { connection, channel };
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    throw error;
  }
}

// Publish task creation event
async function publishTaskCreated(task) {
  try {
    if (!channel) await connectToRabbitMQ();
    
    channel.publish(
      TASK_EXCHANGE,
      'task.created',
      Buffer.from(JSON.stringify(task)),
      { persistent: true }
    );
    
    console.log(`Task creation event published: ${task._id}`);
  } catch (error) {
    console.error('Error publishing task creation:', error);
    throw error;
  }
}

// Publish task update event
async function publishTaskUpdated(task) {
  try {
    if (!channel) await connectToRabbitMQ();
    
    channel.publish(
      TASK_EXCHANGE,
      'task.updated',
      Buffer.from(JSON.stringify(task)),
      { persistent: true }
    );
    
    console.log(`Task update event published: ${task._id}`);
  } catch (error) {
    console.error('Error publishing task update:', error);
    throw error;
  }
}

// Consume task creation events
async function consumeTaskCreated(callback) {
  try {
    if (!channel) await connectToRabbitMQ();
    
    channel.consume(TASK_CREATED_QUEUE, (message) => {
      if (message !== null) {
        const task = JSON.parse(message.content.toString());
        callback(task);
        channel.ack(message);
      }
    });
    
    console.log('Consuming task creation events');
  } catch (error) {
    console.error('Error consuming task creation events:', error);
    throw error;
  }
}

// Consume task update events
async function consumeTaskUpdated(callback) {
  try {
    if (!channel) await connectToRabbitMQ();
    
    channel.consume(TASK_UPDATED_QUEUE, (message) => {
      if (message !== null) {
        const task = JSON.parse(message.content.toString());
        callback(task);
        channel.ack(message);
      }
    });
    
    console.log('Consuming task update events');
  } catch (error) {
    console.error('Error consuming task update events:', error);
    throw error;
  }
}

// Close RabbitMQ connections
async function closeConnection() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('RabbitMQ connection closed');
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error);
  }
}

module.exports = {
  connectToRabbitMQ,
  publishTaskCreated,
  publishTaskUpdated,
  consumeTaskCreated,
  consumeTaskUpdated,
  closeConnection
};