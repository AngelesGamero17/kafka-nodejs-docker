const { Kafka } = require('kafkajs');
const readline = require('readline');
const config = require('./config');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: [config.kafka_server],
});

const producer = kafka.producer();

(async () => {
  await producer.connect();

  console.log('Productor de Kafka listo para enviar mensajes.');

  rl.question('Ingresa el nombre del tópico (o escribe "exit" para salir): ', async function (kafka_topic) {
    if (kafka_topic.toLowerCase() === 'exit') {
      rl.close();
      await producer.disconnect();
      process.exit();
    }

    const admin = kafka.admin();
    await admin.connect();

    const topics = await admin.listTopics();
    await admin.disconnect();

    if (topics.includes(kafka_topic)) {
      console.log('[kafka-producer]: Tópico existente:', kafka_topic);
      sendMessageToTopic(kafka_topic);
    } else {
      console.log('[kafka-producer]: El tópico no existe:', kafka_topic);
      rl.close();
      await producer.disconnect();
      process.exit(1);
    }
  });
})();

async function sendMessageToTopic(kafka_topic) {
  rl.question('Ingresa un mensaje para enviar a Kafka (o escribe "exit" para salir): ', async function (message) {
    if (message.toLowerCase() === 'exit') {
      rl.close();
      await producer.disconnect();
      process.exit();
    }

    await producer.send({
      topic: kafka_topic,
      messages: [{ value: message }],
    });

    console.log('[kafka-producer -> ' + kafka_topic + ']: Mensaje enviado con éxito:', message);

    sendMessageToTopic(kafka_topic);
  });
}

producer.on(producer.events.DISCONNECT, e => console.log('Producer disconnected:', e));
producer.on(producer.events.REQUEST_TIMEOUT, e => console.log('Producer request timed out:', e));
