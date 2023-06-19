import React, {useEffect, useState} from "react";
import styles from '../styles/DailyEventsComponent.module.css';
import axios from "axios";

export default function DailyEventsComponent() {
    const [data, setData] = useState([]);

    const fetchNeos = async () => {
        try {
            const response = await axios.get('/api/neo');
            setData(response.data.map(neo => ({
                name: neo.name,
                approachTime: new Date(neo.close_approach_data[0].close_approach_date_full),
                diameter: neo.estimated_diameter.meters.estimated_diameter_max,
                distance: neo.close_approach_data[0].miss_distance ? neo.close_approach_data[0].miss_distance.kilometers : undefined,
                hazardous: neo.is_potentially_hazardous_asteroid,
            })));
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchNeos();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Upcoming NEO</h1>
            </div>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Approach Time</th>
                    <th>Diameter (m)</th>
                    <th>Distance (km)</th>
                    <th>Potentially Hazardous</th>
                </tr>
                </thead>
                <tbody>
                {data.map(neo =>
                    <tr>
                        <td>{neo.name}</td>
                        <td>{neo.approachTime.toLocaleTimeString()}</td>
                        <td>{Number.parseFloat(neo.diameter).toFixed(3)}</td>
                        <td>{Number.parseFloat(neo.distance).toFixed(3)}</td>
                        <td>{neo.hazardous ? 'Yes' : 'No'}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    )
}