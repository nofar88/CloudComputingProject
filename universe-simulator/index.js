const {sendMessage} = require("./kafkaProducer");

const SECOND = 1000;

const notifyingFactor = ['MMT', 'Gemini Observatory Telescopes', 'Very Large Telescope', 'Subaru Telescope',
    'Large Binocular Telescope', 'Southern African Large Telescope', 'Keck 1 and 2', 'Hobby-Eberly Telescope',
    'Gran Telescopio Canarias', 'The Giant Magellan Telescope', 'Thirty Meter Telescope',
    'European Extremely Large Telescope'];
const eventType = ['GRB', 'Apparent Brightness Rise', 'UV Rise', 'X-Ray Rise', 'Comet'];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate random RA (Right Ascension) in hours
const raHours = () => Math.floor(Math.random() * 24); // Range: 0-23

// Generate random DEC (Declination) in degrees
const decDegrees = () => Math.random() * 180 - 90; // Range: -90 to 90

const randomPriory = () => 1 + Math.floor(Math.random() * 5);

async function main() {
    const response = await fetch('http://localhost:8080/bright-stars');
    const brightStars = (await response.json()).map(s => JSON.parse(s)['harvard_ref_#']);// פירוק הקובץ גייסון שקיבלנו מהשרת ולקיחת הנתון של שמות הכוכבים

// פונקציה שמטרתה להכניס נתונים אקראיים
    setInterval(() => {
        const event = {
            starId: randomItem(brightStars),
            date: Date.now(),
            notifier: randomItem(notifyingFactor),
            location: {DEC: decDegrees(), RA: raHours()},
            event: randomItem(eventType),
            priority: randomPriory()
        };

        console.log(event);
        sendMessage(event)
    }, SECOND * 20);
}

main()
