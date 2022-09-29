const express = require('express');
const cors = require('cors');

require('dotenv').config();
require('./config/mdb.config').setup();

const app = express();

app.use(express.json());
app.use(cors({
	origin: '*',
	credentials: 'true'
}));

app.get('/', async (req, res) => {
	return res.send('This is the Saman.com API server!');
});

app.use('/', require('./routes/index'));

app.listen(
    process.env.PORT || 3000,
    () => console.log(`Listening on PORT ${process.env.PORT}...`)
);