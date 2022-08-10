const express = require('express');
const cors = require('cors');

require('dotenv').config();
require('./mdb/mdb').setup();

const app = express();

app.use(express.json());
app.use(cors({
	origin: '',
	credentials: 'true'
}));

app.get('/', async (req, res) => {
	return res.send('This is the Saman.com API server!');
});