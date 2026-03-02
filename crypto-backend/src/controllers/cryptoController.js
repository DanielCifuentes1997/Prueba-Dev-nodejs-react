const CryptoModel = require('../models/cryptoModel');
const axios = require('axios');

const CryptoController = {
    getAll: async (req, res) => {
        try {
            const cryptos = await CryptoModel.getAllActive();
            res.json(cryptos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getWatchlist: async (req, res) => {
        try {
            const userId = req.params.user_id;
            let rows = await CryptoModel.getWatchlist(userId);

            if (rows.length === 0) {
                return res.json(rows);
            }

            const needsUpdate = rows.some(row => {
                if (!row.recorded_at) return true;
                const diff = (new Date() - new Date(row.recorded_at)) / 1000;
                return diff > 60;
            });

            if (needsUpdate) {
                const symbols = rows.map(r => r.symbol).join(',');
                const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
                    headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY },
                    params: { symbol: symbols, convert: 'USD' }
                });

                const data = response.data.data;
                for (const row of rows) {
                    const coinData = data[row.symbol];
                    if (coinData) {
                        await CryptoModel.savePriceSnapshot(
                            row.id,
                            coinData.quote.USD.price,
                            coinData.quote.USD.volume_24h,
                            coinData.quote.USD.percent_change_24h
                        );
                    }
                }
                rows = await CryptoModel.getWatchlist(userId);
            }

            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    add: async (req, res) => {
        try {
            const { user_id, crypto_id } = req.body;
            await CryptoModel.addToWatchlist(user_id, crypto_id);
            res.status(201).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    remove: async (req, res) => {
        try {
            const { user_id, crypto_id } = req.params;
            await CryptoModel.removeFromWatchlist(user_id, crypto_id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getHistory: async (req, res) => {
        try {
            const history = await CryptoModel.getPriceHistory(req.params.crypto_id);
            res.json(history);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = CryptoController;