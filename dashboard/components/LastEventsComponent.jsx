import React, {useEffect, useState} from "react";
import axios from 'axios';
import styles from '../styles/LastEventsComponent.module.css';
import Image from "next/image";

export default function LastEventsComponent() {
    const [data, setData] = useState({});

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/last-events');
            setData(response.data.hits.hits[0]._source);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchEvents();
        const id = setInterval(fetchEvents, 20000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className={`${styles.container} ${data.priority >= 4  ? styles.blink : ''}`}>
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