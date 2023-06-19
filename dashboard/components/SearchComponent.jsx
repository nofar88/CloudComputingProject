import React, {useCallback, useEffect, useState} from "react";
import styles from '../styles/SearchComponent.module.css';
import classNames from "classnames/bind";
import axios from "axios";

const cx = classNames.bind(styles);

const notifyingFactor = ['MMT', 'Gemini Observatory Telescopes', 'Very Large Telescope', 'Subaru Telescope',
    'Large Binocular Telescope', 'Southern African Large Telescope', 'Keck 1 and 2', 'Hobby-Eberly Telescope',
    'Gran Telescopio Canarias', 'The Giant Magellan Telescope', 'Thirty Meter Telescope',
    'European Extremely Large Telescope'];
const eventType = ['GRB', 'Apparent Brightness Rise', 'UV Rise', 'X-Ray Rise', 'Comet'];

export default function SearchComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [cometInput, setCometInput] = useState('');
    const [notifierInput, setNotifierInput] = useState('');
    const [priorityInput, setPriorityInput] = useState('');
    const [eventInput, setEventInput] = useState('');
    const [timeFromInput, setTimeFromInput] = useState(null);
    const [timeToInput, setTimeToInput] = useState(null);

    const [results, setResults] = useState([]);

    const fetchComets = async () => {
        try {
            const response = await axios.get('/api/comets');
            setComets(response.data.map(comet => JSON.parse(comet)));
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchComets();
    }, []);

    const closeSearch = useCallback(() => {
        setIsOpen(false);
    }, []);

    const search = async () => {
        const searchParams = {};

        if (textInput) {
            searchParams.text = textInput;
        }

        if (cometInput) {
            searchParams.comet = cometInput;
        }

        if (notifierInput) {
            searchParams.notifier = notifierInput;
        }

        if (timeFromInput && timeToInput) {
            searchParams.time = {from: timeFromInput, to: timeToInput};
        }

        if (priorityInput) {
            searchParams.priority = priorityInput;
        }

        if (eventInput) {
            searchParams.event = eventInput;
        }

        try {
            if (Object.keys(searchParams).length !== 0) {
                const response = await axios.post('/api/search', searchParams);
                setResults(response.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        search();
    }, [textInput, cometInput, notifierInput, timeFromInput, timeToInput, priorityInput, eventInput]);


    const renderNotifier = (selected) => {
        return (
            <label className={cx(styles.label, {[styles.invisible]: selected ? !notifierInput : notifierInput})}
                   key="notifier">
                Notifier:
                <input list="notifier"
                       placeholder="select notifier"
                       value={notifierInput}
                       onChange={(e) => setNotifierInput(e.target.value)}/>
                <datalist id="notifier">
                    {notifyingFactor && notifyingFactor.map(notifier => <option>{notifier}</option>)}
                </datalist>
            </label>
        );
    };

    const renderTime = (selected) => {
        return (
            <label
                className={cx(styles.label, {[styles.invisible]: selected ? !(timeFromInput && timeToInput) : (timeFromInput && timeToInput)})}>
                Time range: from
                <input type="date"
                       value={timeFromInput}
                       onChange={(e) => setTimeFromInput(e.target.value)}/>
                {' '}
                to
                {' '}
                <input type="date"
                       value={timeToInput}
                       onChange={(e) => setTimeToInput(e.target.value)}/>
            </label>
        );
    };

    const renderPriority = (selected) => {
        return (
            <label className={cx(styles.label, {[styles.invisible]: selected ? !priorityInput : priorityInput})}
                   key="priority">
                Priority:
                <input list="priority"
                       placeholder="select priority"
                       value={priorityInput}
                       onChange={(e) => setPriorityInput(e.target.value)}/>
                <datalist id="priority">
                    {[1, 2, 3, 4, 5].map(priority => <option>{priority}</option>)}
                </datalist>
            </label>
        );
    };

    const renderEvent = (selected) => {
        return (
            <label className={cx(styles.label, {[styles.invisible]: selected ? !eventInput : eventInput})}
                   key="event">
                Event Type:
                <input list="event"
                       placeholder="select event"
                       value={eventInput}
                       onChange={(e) => setEventInput(e.target.value)}/>
                <datalist id="event">
                    {eventType && eventType.map(event => <option>{event}</option>)}
                </datalist>
            </label>
        );
    };

    return (
        <div className={cx(styles.container, {[styles.containerFocused]: isOpen})}>
            {isOpen &&
                <button className={styles.closeButton}
                        type="button"
                        onClick={closeSearch}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            }
            <div className={styles.searchBox}>
                <span className="material-symbols-outlined">search</span>
                {!isOpen && <button className={styles.searchButton} onClick={() => setIsOpen(true)}>
                    Search event...
                </button>
                }
                {isOpen &&
                    <>
                        {renderNotifier(true)}
                        {renderTime(true)}
                        {renderPriority(true)}
                        {renderEvent(true)}
                    </>
                }
            </div>
            {isOpen &&
                <>
                    <div className={styles.labels}>
                        <>
                            {renderNotifier(false)}
                            {renderTime(false)}
                            {renderPriority(false)}
                            {renderEvent(false)}
                        </>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Comet Name</th>
                                <th>Date</th>
                                <th>Priority</th>
                                <th>Event Type</th>
                                <th>Notifier</th>
                                <th>Location</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results.map(comet =>
                                <tr>
                                    <td>{comet.starId}</td>
                                    <td>{new Date(comet.date).toLocaleDateString()}</td>
                                    <td>{comet.priority}</td>
                                    <td>{comet.event}</td>
                                    <td>{comet.notifier}</td>
                                    <td>{`DEC: ${comet.location?.DEC.toFixed(4)}, RA: ${comet.location?.RA}`}</td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                </>
            }
        </div>
    )
}