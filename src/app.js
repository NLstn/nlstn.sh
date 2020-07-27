const express = require('express');
const helmet = require('helmet');

require('dotenv').config();

const app = express();

app.use(helmet());
app.use(express.json());

app.get('/:name', async (req, res) => {
    res.status(200);
    res.redirect(`https://github.com/${req.params.name}`)
});

app.post('/api/add', async (req, res) => {
    res.status(404);
    res.json({
        message: 'Not yet implemented'
    })
});

module.exports = app;