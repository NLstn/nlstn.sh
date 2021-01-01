const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const nanoid = require('nanoid').nanoid;

const Shorts = require('./models/shorts');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan(':method :url :status :response-time ms'));

app.get('/:name', async (req, res) => {

    const short = await Shorts.findOne({ id: req.params.name });
    console.log(req.params.name);
    if (!short.url) {
        res.status(400).send();
        return;
    }
    console.log(short.url);
    res.redirect(short.url);
});

app.post('/api/v1/add', async (req, res) => {
    if (!req.body.url) {
        res.status(400).send({ message: 'URL not found in request' });
        return;
    }

    let id;
    while (true) {
        id = nanoid();
        console.log(`Probing: ${id}`);
        let existingShort = await Shorts.findOne({ id: id });
        console.log(existingShort);
        if (!existingShort.url)
            break;
    }
    const short = new Shorts({
        id: id,
        url: req.body.url
    });
    await short.save();
    res.status(200).send({ message: 'Created successfully', id: id });

});

module.exports = app;