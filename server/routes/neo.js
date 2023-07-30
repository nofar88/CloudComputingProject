const express = require('express');
const router = express.Router();

const API_KEY = 'U51cKcuEUk0EgmGLI1qeetnBK8iTu3tsLxepkOVs';
const ALBEDO = 0.15;
// גרף עוגה + טבלה
// פונקציה שמקבלת תאריך ומחזירה אותו בפורמט מסויים
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// חישוב היקף של כוכב לפי עוצמת האור שלו
const calculateDiameter = (absoluteMagnitude, albedo) => 1000 * (1329 / Math.sqrt(albedo) * Math.pow(10, -0.2 * absoluteMagnitude));

// פנייה לAPI שיביא לנו את כל האירועים מהיום עד מחר
router.get('/', async function (req, res, next) {
    try {
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 60 * 60 * 24 * 1000);
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?api_key=${API_KEY}&start_date=${formatDate(today)}&end_date=${formatDate(tomorrow)}`);
        const result = (await response.json())['near_earth_objects'];
        res.send([...Object.values(result)[0], ...Object.values(result)[1]]);
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

// פנייה לAPI שיביא לנו את כל האירועים מהחודש האחרון
router.get('/past', async function (req, res, next) {
    try {
        const today = new Date();
        const monthAgo = new Date(today.getTime() - 60 * 60 * 24 * 1000 * 30);
        const response = await fetch(`https://ssd-api.jpl.nasa.gov/cad.api?date-min=${formatDate(monthAgo)}&date-max=${formatDate(today)}`);
        let data = await response.json();
        data = data.data.map(neo => calculateDiameter(neo[10], ALBEDO));

        const minDiameter = Math.floor(Math.min(...data));
        const maxDiameter = Math.ceil(Math.max(...data));
        const offset = Math.round((maxDiameter - minDiameter) / 5);

        // מחלק את הנתונים לקבוצות לפי ההיקף בשביל הגרף עוגה
        const groups = {};
        for (let i = minDiameter + offset; i < maxDiameter + offset; i += offset) {
            groups[i] = 0;
        }

        for (const diameter of data) {
            for (const size of Object.keys(groups).sort((a, b) => a - b)) {
                if (diameter < size) {
                    groups[size]++;
                    break;
                }
            }
        }

        res.send({maxDiameter, minDiameter, offset, groups});
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

module.exports = router;
