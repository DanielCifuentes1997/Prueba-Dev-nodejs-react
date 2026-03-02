import apiClient from './apiClient';

const cryptoService = {
    getAllCryptos: async () => {
        const response = await apiClient.get('/cryptos');
        return response.data;
    },

    getWatchlist: async (userId) => {
        const response = await apiClient.get(`/watchlist/${userId}`);
        return response.data;
    },

    addToWatchlist: async (userId, cryptoId) => {
        const response = await apiClient.post('/watchlist', { user_id: userId, crypto_id: cryptoId });
        return response.data;
    },

    removeFromWatchlist: async (userId, cryptoId) => {
        const response = await apiClient.delete(`/watchlist/${userId}/${cryptoId}`);
        return response.data;
    },

    getPriceHistory: async (cryptoId) => {
        const response = await apiClient.get(`/prices/history/${cryptoId}`);
        return response.data;
    }
};

export default cryptoService;