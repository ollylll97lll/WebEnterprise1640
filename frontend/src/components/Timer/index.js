import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
moment.locale('en');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function Timer() {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        let secTimer = setInterval(() => {
            setCurrentTime(new moment().format('HH:mm:ss'))
        }, 1000)

        return () => clearInterval(secTimer);
    }, []);

    return (
        <div>
            {capitalizeFirstLetter(moment().format(`dddd, DD/MM/YYYY ㅤHH:mm:ss`))}
        </div>
    )
}

export default Timer
