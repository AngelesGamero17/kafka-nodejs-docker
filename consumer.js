const kafka = require('kafka-node');
const config = require('./config');

try {
  // Create a Kafka client
  const client = new kafka.KafkaClient({ kafkaHost: config.kafka_server });

  // Retrieve the list of topics
  client.loadMetadataForTopics([], (error, results) => {
    if (error) {
      console.error('Error loading metadata:', error);
      return;
    }

    const topicNames = Object.keys(results[1].metadata);

    // Create a single consumer for all topics
    const topicsToSubscribe = topicNames.map(topicName => ({ topic: topicName }));

    const consumer = new kafka.Consumer(client, topicsToSubscribe);

    consumer.on('message', function (message) {
      console.log('Received message from topic', message.topic, ':', message.value);
    });

    consumer.on('error', function (err) {
      console.log('Consumer error:', err);
    });
  });
} catch (e) {
  console.log(e);
}