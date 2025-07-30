// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

// دالة مساعدة لقراءة القيمة من localStorage بأمان
function getStoredValue<T>(key: string, defaultValue: T): T {
    try {
        const saved = localStorage.getItem(key);
        if (saved !== null) {
            return JSON.parse(saved);
        }
        return defaultValue;
    } catch (error) {
        console.error("Error reading localStorage key “" + key + "”:", error);
        return defaultValue;
    }
}

export function useLocalStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState(() => {
        return getStoredValue(key, defaultValue);
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error writing to localStorage key “" + key + "”:", error);
        }
    }, [key, value]);

    return [value, setValue];
}