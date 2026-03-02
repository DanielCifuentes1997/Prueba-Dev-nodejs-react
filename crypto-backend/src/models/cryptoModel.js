const pool = require('../config/database');

const CryptoModel = {
    getAllActive: async () => {
        const [rows] = await pool.query('SELECT cmc_id AS id, symbol, name FROM cryptocurrencies');
        return rows;
    },
    getWatchlist: async (userId) => {
        const query = `
            SELECT c.cmc_id AS id, c.symbol, c.name, ph.price_usd AS price, ph.percent_change_24h, ph.volume_24h, ph.recorded_at
            FROM user_watchlist uw
            JOIN cryptocurrencies c ON uw.cmc_id = c.cmc_id
            LEFT JOIN (
                SELECT cmc_id, price_usd, percent_change_24h, volume_24h, recorded_at
                FROM price_history
                WHERE history_id IN (SELECT MAX(history_id) FROM price_history GROUP BY cmc_id)
            ) ph ON c.cmc_id = ph.cmc_id
            WHERE uw.user_id = ?
        `;
        const [rows] = await pool.query(query, [userId]);
        return rows;
    },
    addToWatchlist: async (userId, cryptoId) => {
        return await pool.query('INSERT IGNORE INTO user_watchlist (user_id, cmc_id) VALUES (?, ?)', [userId, cryptoId]);
    },
    removeFromWatchlist: async (userId, cryptoId) => {
        return await pool.query('DELETE FROM user_watchlist WHERE user_id = ? AND cmc_id = ?', [userId, cryptoId]);
    },
    getPriceHistory: async (cryptoId) => {
        const [rows] = await pool.query(
            'SELECT price_usd AS price, DATE_FORMAT(recorded_at, "%H:%i") as time FROM price_history WHERE cmc_id = ? ORDER BY recorded_at ASC LIMIT 50',
            [cryptoId]
        );
        return rows;
    },
    savePriceSnapshot: async (cryptoId, price, volume, change) => {
        return await pool.query(
            'INSERT INTO price_history (cmc_id, price_usd, volume_24h, percent_change_24h) VALUES (?, ?, ?, ?)',
            [cryptoId, price, volume, change]
        );
    }
};

module.exports = CryptoModel;