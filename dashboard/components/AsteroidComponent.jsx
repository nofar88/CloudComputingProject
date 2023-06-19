import React, {useEffect, useState} from "react";
import {Chart} from "react-google-charts";
import styles from '../styles/AsteroidComponent.module.css';
import axios from "axios";

const options = {
    backgroundColor: 'transparent',
    chartArea: {width: '95%', height: '100%'},
    colors: ['#2AA1DB', '#00608F', '#DB8B2A', '#FFAE4A', '#8F550E'],
    pieSliceBorderColor: 'transparent',
    legend: {textStyle: {color: 'white'}}
};

export default function AsteroidComponent() {
    const [data, setData] = useState([['Size', 'Amount']]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/neo-past');
            const {minDiameter, groups} = response.data;

            const labels = [minDiameter, ...Object.keys(groups)];
            const result = [['Size', 'Amount']];
            for (let i = 1; i < labels.length; i++) {
                result.push([`${labels[i - 1]}m-${labels[i]}m`, groups[labels[i]]]);
            }
            setData(result);
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
                <h1>Past Month NEO</h1>
            </div>
            <Chart
                chartType="PieChart"
                data={data}
                options={options}
                width={"100%"}
                height={"100%"}
            />
        </div>
    )
}