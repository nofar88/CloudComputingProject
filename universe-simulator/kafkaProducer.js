// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const topic = 'qopxjgol-events';

//יצירת מופע של קפקה והתחברות אליו
const {Kafka} = require("kafkajs");// פעולה שמביאה את הספריה של קפקה
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
// יוצרים יצרן שמטרתו היא ליצור את האירועים ולשלוח אותם לקפקה שבענן
const producer = kafka.producer();
(async () => {
    await producer.connect();
})()

// שליחת המאורע לענן של קפקה והודעה אם עבד או לא
const sendMessage = async (event) => {
    try {
        await producer.send({
            topic,
            messages: [{value: JSON.stringify(event)}],
        });

        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message', error);
    }
};
// עושה אקספורט לקפקה שבענן
module.exports = {sendMessage};