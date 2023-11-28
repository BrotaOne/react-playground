import { useState, useEffect } from "react";

type useLocalStorageType = <T extends Function | string | number | Record<string, any>>
    (key: string, initialValue: T) => [T, React.Dispatch<T>];

const useLocalStorage:  useLocalStorageType = (
    key,
    initialValue
)=>{
    const [value, setValue] = useState(() => {
        const jsonValue = localStorage.getItem(key);
        if (jsonValue != null) return JSON.parse(jsonValue);
        if (typeof initialValue === 'function') {
            return initialValue();
        } else {
            return initialValue;
        }
    });
    useEffect(() => {
        if (value === undefined) {
            return localStorage.removeItem(key);
        }
        localStorage.setItem(key, JSON.stringify(value));
    },
        [key, value]
    );
    return [value, setValue];
}

export default useLocalStorage;