const express = require('express');
const cors = require('cors');
const cryptoRoutes = require('./src/routes/cryptoRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', cryptoRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});