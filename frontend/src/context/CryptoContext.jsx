import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
    const [cryptos, setCryptos] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [history, setHistory] = useState({});

    const API_URL = 'http://localhost:3001/api';
    const USER_ID = 1;

    const fetchCryptos = async () => {
        try {
            const response = await axios.get(`${API_URL}/cryptos`);
            setCryptos(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchWatchlist = async () => {
        try {
            const response = await axios.get(`${API_URL}/watchlist/${USER_ID}`);
            setWatchlist(response.data);
            response.data.forEach(coin => fetchHistory(coin.id));
        } catch (error) {
            console.error(error);
        }
    };

    const addToWatchlist = async (cryptoId) => {
        try {
            await axios.post(`${API_URL}/watchlist`, { user_id: USER_ID, crypto_id: cryptoId });
            fetchWatchlist();
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromWatchlist = async (cryptoId) => {
        try {
            await axios.delete(`${API_URL}/watchlist/${USER_ID}/${cryptoId}`);
            fetchWatchlist();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchHistory = async (cryptoId) => {
        try {
            const response = await axios.get(`${API_URL}/prices/history/${cryptoId}`);
            setHistory(prev => ({ ...prev, [cryptoId]: response.data }));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCryptos();
        fetchWatchlist();

        const interval = setInterval(() => {
            fetchWatchlist();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <CryptoContext.Provider value={{
            cryptos,
            watchlist,
            history,
            addToWatchlist,
            removeFromWatchlist,
            fetchHistory,
            fetchWatchlist
        }}>
            {children}
        </CryptoContext.Provider>
    );
};