const express = require('express');
const router = express.Router();
const bodybuilder = require('bodybuilder');

const {Client} = require('elasticsearch');
const client = new Client({node: 'http://localhost:5601'});
const index = 'qopxjgol-events';

// קבלת כל האירועים שקרו בשבוע האחרון
router.get('/', async function (req, res, next) {
    try {
        // לקיחת זמנים של היום ושל לפני שבוע
        const now = Date.now();
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
        const reply = await client.search({
            index,
            size: 10000,
            body: {
                query: {
                    range: {
                        date: {
                            gte: oneWeekAgo,
                            lte: now,
                        },
                    },
                },
            },
        });

        res.send(reply);
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

// מסדר את האירועים בסדר יורד ולוקח את האחרון ואז שולח
router.get('/last', async function (req, res, next) {
    try {
        const reply = await client.search({
            index,
            body: {
                size: 1,
                sort: [{date: 'desc'}]
            }
        });

        res.send(reply);
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

// בקשה מסוג פוסט שעושה חיפוש
// מסוג פוסט כי יש הרבה נתונים שלא נוח להכניס אותם בבקשת get
router.post('/search', async (req, res) => {
    try {
        // פנייה לתוך גוף הבקשה ופירוק שלה לרכיבים
        const { notifier, time, priority, event } = req.body;

        const query = bodybuilder();

        // שאילתות על מנת לקבל נתונים לטבלה של החיפוש
        if (priority) {
            query.andQuery('match', 'priority', priority);
        }

        if (notifier) {
            query.andQuery('term', 'notifier.keyword', notifier);
        }

        if (event) {
            query.andQuery('term', 'event.keyword', event);
        }

        if (time && time.from && time.to) {
            query.andQuery('range', 'date', {
                gte: new Date(time.from).getTime(),
                lte: new Date(time.to).getTime(),
            });
        }

        // פנייה לאלסטיק-סרצ' עם כל השאילתתה שהוא בנה
        const reply = await client.search({
            index,
            size: 500,
            body: query.build(), // Get the final Elasticsearch query from BodyBuilder
        });

        // מחזיר את התוצאות ללקוח
        const results = reply.hits.hits.map((hit) => hit._source);
        res.json(results);
    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).json({ error: 'An error occurred during search.' });
    }
});


module.exports = router;