import { useEffect, useRef } from 'react';

export default function UseClickOutside(handler) {
    const ref = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                handler(); // This will call the function to close the dropdown
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handler]);

    return ref;
}
