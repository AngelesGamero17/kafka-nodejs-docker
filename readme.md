npm init 
npm i

#### para ejecutar la imagen de docker
docker-compose up

#### para crear el topic
docker exec -it broker1 kafka-topics --create --topic mi-topico2 --partitions 1 --replication-factor 1 --if-not-exists --bootstrap-server localhost:9092

### para listar los topicos
docker exec -it broker1 kafka-topics --list --bootstrap-server localhost:9092

#### para describir los topicos
docker exec -it broker1 kafka-topics --describe --bootstrap-server localhost:9092

## para ejecutar el productor y consumidor , en consolas diferentes
 node producer.js

 node consumer.js


