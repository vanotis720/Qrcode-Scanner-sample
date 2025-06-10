import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'SCAN_HISTORY';

export const addToHistory = async (item) => {
    try {
        const existing = await AsyncStorage.getItem(HISTORY_KEY);
        const history = existing ? JSON.parse(existing) : [];
        history.unshift({ ...item, date: new Date().toISOString() }); // add timestamp
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50))); // keep last 50
    } catch (e) {
        // handle error
    }
};

export const getHistory = async () => {
    try {
        const existing = await AsyncStorage.getItem(HISTORY_KEY);
        return existing ? JSON.parse(existing) : [];
    } catch (e) {
        return [];
    }
};

export const clearHistory = async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
};

export const removeFromHistory = async (index) => {
    try {
        const existing = await AsyncStorage.getItem(HISTORY_KEY);
        if (existing) {
            const history = JSON.parse(existing);
            history.splice(index, 1);
            await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }
    } catch (e) {
        // handle error
    }
};