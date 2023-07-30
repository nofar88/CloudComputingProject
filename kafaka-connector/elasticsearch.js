const {Client} = require('elasticsearch');
const client = new Client({node: 'http://localhost:5601'});

const index = 'test-index';

// פונקציה שמטרת לשמור את המאורע שנוצר בתוך האלסטיקס
async function saveDocument(data, topic) {
    try {
        const response = await client.index({index: topic, body: data});
        console.log(response);
    } catch (e) {
        console.log(e);
    }
}


module.exports = {saveDocument};


