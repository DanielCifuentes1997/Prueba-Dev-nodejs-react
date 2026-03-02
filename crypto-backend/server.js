const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const pool = require('./database');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
const API_KEY = process.env.CMC_API_KEY;

const fetchAndStoreCryptoData = async () => {
    try {
        const [cryptos] = await pool.query('SELECT id, symbol FROM cryptocurrencies WHERE is_active = 1');
        
        if (cryptos.length === 0) return;

        const symbols = cryptos.map(c => c.symbol).join(',');

        const response = await axios.get(CMC_API_URL, {
            headers: {
                'X-CMC_PRO_API_KEY': API_KEY,
            },
            params: {
                symbol: symbols,
                convert: 'USD'
            }
        });

        const data = response.data.data;

        for (const crypto of cryptos) {
            const coinData = data[crypto.symbol];
            if (coinData) {
                const price = coinData.quote.USD.price;
                const volume24h = coinData.quote.USD.volume_24h;
                const percentChange24h = coinData.quote.USD.percent_change_24h;

                await pool.query(
                    'INSERT INTO price_history (crypto_id, price, volume_24h, percent_change_24h) VALUES (?, ?, ?, ?)',
                    [crypto.id, price, volume24h, percentChange24h]
                );
            }
        }
    } catch (error) {
        console.error(error.message);
    }
};

cron.schedule('*/5 * * * *', () => {
    fetchAndStoreCryptoData();
});

app.get('/api/cryptos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cryptocurrencies WHERE is_active = 1');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/watchlist/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const query = `
            SELECT c.id, c.symbol, c.name, ph.price, ph.percent_change_24h, ph.volume_24h
            FROM user_portfolios up
            JOIN cryptocurrencies c ON up.crypto_id = c.id
            LEFT JOIN (
                SELECT crypto_id, price, percent_change_24h, volume_24h
                FROM price_history
                WHERE id IN (SELECT MAX(id) FROM price_history GROUP BY crypto_id)
            ) ph ON c.id = ph.crypto_id
            WHERE up.user_id = ?
        `;
        const [rows] = await pool.query(query, [user_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/watchlist', async (req, res) => {
    try {
        const { user_id, crypto_id } = req.body;
        await pool.query('INSERT IGNORE INTO user_portfolios (user_id, crypto_id) VALUES (?, ?)', [user_id, crypto_id]);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/watchlist/:user_id/:crypto_id', async (req, res) => {
    try {
        const { user_id, crypto_id } = req.params;
        await pool.query('DELETE FROM user_portfolios WHERE user_id = ? AND crypto_id = ?', [user_id, crypto_id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/prices/history/:crypto_id', async (req, res) => {
    try {
        const { crypto_id } = req.params;
        const [rows] = await pool.query('SELECT price, DATE_FORMAT(recorded_at, "%H:%i") as time FROM price_history WHERE crypto_id = ? ORDER BY recorded_at ASC LIMIT 50', [crypto_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    fetchAndStoreCryptoData();
});