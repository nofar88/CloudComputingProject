import React, {useEffect, useState} from "react";
import styles from '../styles/SunComponent.module.css';
import axios from "axios";
import Image from "next/image";

export default function SunComponent() {
    const [data, setData] = useState({
        img: undefined,
        rise: 'Loading...',
        set: 'Loading...',
        rightAscension: 'Loading...',
        declination: 'Loading...',
        constellation: 'Loading...',
        magnitude: 'Loading...',
    });
    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/sun');
            setData(response.data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Sun Activity</h1>
                <p>Current sunspot activity</p>
            </div>
            <div className={styles.sunImage}>
                <Image src={data.img} alt="sun image" fill/>
            </div>

            <div className={styles.data}>
                <p><span>Right Ascension: </span>{data.rightAscension}</p>
                <p><span>Declination: </span>{data.declination}</p>
                <p><span>Constellation: </span>{data.constellation}</p>
                <p><span>Magnitude: </span>{data.magnitude}</p>
                <p><span>Sun Rise: </span>{data.rise}</p>
                <p><span>Sun Set: </span>{data.set}</p>
            </div>
        </div>
    )
}