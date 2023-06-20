import React, {useEffect, useState} from "react";
import styles from '../styles/EventsGraphComponent.module.css';
import axios from "axios";

function processData(data) {
    const result = [0, 0, 0, 0, 0];
    data.forEach(item => result[item.priority - 1] += 1);
    return result;
}

export default function EventsGraphComponent() {
    const [data, setData] = useState([0, 0, 0, 0, 0]);

    // פניה לשרת לקבלת האירועים בשבוע האחרון
    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/events');
            setData(processData(response.data.hits.hits.map(item => item._source)));
        } catch (e) {
            console.error(e);
        }
    }

    // מריץ את הפונקציה שאחראית להביא את האירועים האחרונים ומתמזמן שתרוץ פעם ב20 שניות
    useEffect(() => {
        fetchEvents();
        const id = setInterval(fetchEvents, 20000);
        return () => clearInterval(id);
    }, []);

    // לקיחת כל הנתונים הרלוונטיים והצגתם
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>This Week Events</h1>
                <h2>Total: {data.reduce((a, b) => a + b)} events</h2>
            </div>
            <div className={styles.graph}>
                <p className={styles.XLabel}><strong>Amount</strong></p>
                {data.map((item, index) =>
                    <div className={styles.barContainer}>
                        <p>{item}</p>
                        <div className={styles.bar} style={{height: (item / Math.max(...data)) * 100}}/>
                        <p><strong>{index + 1}</strong></p>
                    </div>
                )}
            </div>
            <p className={styles.YLabel}><strong>Priority</strong></p>
        </div>
    )
}