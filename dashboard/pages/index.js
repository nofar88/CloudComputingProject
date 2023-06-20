import Head from 'next/head'
import {Inter} from 'next/font/google'
import styles from '@/styles/Home.module.css'
import SearchComponent from "@/components/SearchComponent";
import LastEventsComponent from "@/components/LastEventsComponent";
import EventsGraphComponent from "@/components/EventsGraphComponent";
import SunComponent from "@/components/SunComponent";
import DailyEventsComponent from "@/components/DailyEventsComponent";
import AsteroidComponent from "@/components/AsteroidComponent";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    return (
        <>
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="NEO and sun dashboard"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={`${styles.main} ${inter.className}`}>
                <SearchComponent/>
                <LastEventsComponent/>
                <EventsGraphComponent/>
                <SunComponent/>
                <DailyEventsComponent/>
                <AsteroidComponent/>
            </main>
        </>
    )
}
