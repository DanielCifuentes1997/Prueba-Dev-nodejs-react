const express = require('express');
const router = express.Router();
const CryptoController = require('../controllers/cryptoController');

router.get('/cryptos', CryptoController.getAll);
router.get('/watchlist/:user_id', CryptoController.getWatchlist);
router.post('/watchlist', CryptoController.add);
router.delete('/watchlist/:user_id/:crypto_id', CryptoController.remove);
router.get('/prices/history/:crypto_id', CryptoController.getHistory);

module.exports = router;