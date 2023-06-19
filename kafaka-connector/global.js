
// המידע עצמו כשחיברנו באמצעות האי פי אי מהאתר
const {Kafka} = require("kafkajs");
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: "dory-01.srvs.cloudkafka.com:9094,dory-02.srvs.cloudkafka.com:9094,dory-03.srvs.cloudkafka.com:9094".split(","),
    ssl: true,
    sasl: {
        mechanism: 'scram-sha-256',
        username: 'qopxjgol',
        password: 'BaYEq9zPoxOGf9j33qBriIoBSgzRFRAm',
    },
});

const NEO_EARTH_CLOSE_TOPIC = 'qopxjgol-neo-earth-close';
const ASTEROID_NEO_WS_TOPIC = 'qopxjgol-asteroids-neo-ws';
const GROUP_ID = 'qopxjgol-neo-earth-close-group';

module.exports = {kafka, NEO_EARTH_CLOSE_TOPIC, ASTEROID_NEO_WS_TOPIC, GROUP_ID};