const server = require('socket.io');
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

// יצירת השרת , שרת רנדומלי 1234 התחברות ודחיפה למערך הסוקטים
// על מנת שנזהה מי התחבר - אבל בגדול רק מישהו אחד אמור להתחבר
async function main() {
    const io = new server.Server(1234, {
        cors: {
            origin: "*",
        }
    });
    const sockets = [];
    io.on('connection', (socket) => {
            sockets.push(socket);
        }
    )

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
        sendMessage(event);

        // אם הרמת דחיפות מעל 4 א ישר זה ישלח לדאשבורד והדאבורד לא יצטרך לבקש .
        if (event.priority >= 4) {
            try {
                sockets.forEach(socket => {
                    socket.emit('event', event)
                })
            } catch (e) {
                console.log(e);
            }
        }
    }, SECOND * 20);
}

main()


