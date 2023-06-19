// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const {kafka, NEO_EARTH_CLOSE_TOPIC, GROUP_ID, ASTEROID_NEO_WS_TOPIC} = require('./global');
const {saveDocument} = require("./elasticsearch");

(async () => {
    const consumer = kafka.consumer({groupId: GROUP_ID});

    // פונקציה שמתחברת לקפקה שבענן
    async function connect() {
        await consumer.connect();
    }

    // פונקציה שנרשמת לקבלת עידכונים על טופיק מסוים
    async function subscribe() {
        await consumer.subscribe({topic: 'qopxjgol-events'});
    }

    // ברגע שנכנס מאורע חדש לתוך הטופיק הפונקציה הזאת פועלת בכך שהיא שומרת את המאורע ואז הפונקציה של השמירת מסמך דוחפת את המאורע לתוך האלקסטיק
    async function consume() {
        await consumer.run({
            eachMessage: async ({topic, partition, message}) => {
                await saveDocument(message.value.toString(), topic);
                console.log({
                    topic,
                    value: message.value.toString()
                });
            }
        });
    }

    // מדפיס במקרה שיש שגיאה
    consumer.on('consumer.crash', (e) => {
        console.log(e);
    });

    async function startConsumer() {
        await connect();
        await subscribe();
        await consume();
    }

    startConsumer().catch(console.error);
})();