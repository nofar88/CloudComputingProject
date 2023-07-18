import React, {useEffect, useMemo, useState} from "react";
import axios from 'axios';
import styles from '../styles/LastEventsComponent.module.css';
import Image from "next/image";
import socketio from 'socket.io-client';

const SECOND = 1000;

export default function LastEventsComponent() {
    const [data, setData] = useState({});

    useEffect(() => {
        // פרוטוקול WS שמפאשר לקבל עדכונים ישירות מהשרת בלי לבקש ממנו בעצמנו
        // מתחברים לשרת של הsocket
        const socket = socketio("http://localhost:1234", {
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        });

        // נרשמים לאירועים שמגיעים על הsocket
        socket.on("event", (data) => {
            setData(data);
        });

        return () => socket.disconnect();
    }, []);

    // פניה לשרת לקבלת האירוע האחרון
    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/last-events');
            setData(response.data.hits.hits[0]._source);
        } catch (e) {
            console.error(e);
        }
    }

    // מריץ את הפונקציה שאחראית להביא את האירוע האחרון ומתמזמן שתרוץ פעם ב20 שניות
    useEffect(() => {
        fetchEvents();
        const id = setInterval(fetchEvents, 20 * SECOND);
        return () => clearInterval(id);
    }, []);

    // לקיחת כל הנתונים הרלוונטיים והצגתם
    return (
        <div className={`${styles.container} ${data.priority >= 4 ? styles.blink : ''}`}>
            <div className={styles.header}>
                <h1>Last Event</h1>
                <div>
                    <h2>Comet #{data.starId}</h2>
                    <p>{`${new Date(data.date).toLocaleDateString()} ${new Date(data.date).toLocaleTimeString()}`}</p>
                </div>
            </div>
            <div className={styles.data}>
                <Image src="/comet.png" alt="comet" height={170} width={170}/>
                <div>
                    <p><span>Priority: </span>{data.priority}</p>
                    <p><span>Event Type: </span>{data.event}</p>
                    <p><span>Notifier: </span>{data.notifier}</p>
                    <p><span>Location: </span>DEC - {data.location?.DEC.toFixed(4)}, RA - {data.location?.RA}</p>
                </div>
            </div>
        </div>
    )
}