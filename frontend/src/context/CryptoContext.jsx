import { createContext, useState, useEffect, useCallback } from 'react';
import cryptoService from '../services/cryptoService';

export const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
    const [cryptos, setCryptos] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [history, setHistory] = useState({});

    const USER_ID = 1;

    const fetchCryptos = async () => {
        try {
            const data = await cryptoService.getAllCryptos();
            setCryptos(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchHistory = useCallback(async (cryptoId) => {
        try {
            const data = await cryptoService.getPriceHistory(cryptoId);
            setHistory(prev => ({ ...prev, [cryptoId]: data }));
        } catch (error) {
            console.error(error.message);
        }
    }, []);

    const fetchWatchlist = useCallback(async () => {
        try {
            const data = await cryptoService.getWatchlist(USER_ID);
            setWatchlist(data);
            
            const historyPromises = data.map(coin => fetchHistory(coin.id));
            await Promise.all(historyPromises);
        } catch (error) {
            console.error(error.message);
        }
    }, [fetchHistory]);

    const addToWatchlist = async (cryptoId) => {
        try {
            await cryptoService.addToWatchlist(USER_ID, cryptoId);
            await fetchWatchlist();
        } catch (error) {
            console.error(error.message);
        }
    };

    const removeFromWatchlist = async (cryptoId) => {
        try {
            await cryptoService.removeFromWatchlist(USER_ID, cryptoId);
            setWatchlist(prev => prev.filter(item => item.id !== cryptoId));
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchCryptos();
        fetchWatchlist();

        const interval = setInterval(fetchWatchlist, 30000);
        return () => clearInterval(interval);
    }, [fetchWatchlist]);

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