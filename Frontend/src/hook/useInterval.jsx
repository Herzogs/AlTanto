import { useEffect, useRef } from 'react';

// eslint-disable-next-line react/prop-types
const Interval = ({ callback, delay }) => {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
    return null;
}

export default Interval;