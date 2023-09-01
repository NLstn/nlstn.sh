const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const shortSchema = mongoose.Schema({
    name: String,
    url: String,
});

const Short = mongoose.model('Short', shortSchema);

main();

async function main() {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    if(!connectionString) {
        console.error('MONGODB_CONNECTION_STRING environment variable not set');
        return;
    }
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    
    const port = process.env.API_PORT || 5000;

    const app = await initExpress();

    app.listen(port, () => console.log('Listening on port ' + port));
}

async function initExpress() {
    const app = express();

    app.get('/:shortName', async (req, res) => {
        try {
            const name = req.params.shortName;
            
            const short = await Short.findOne({ name: name });
            if(!short) {
                res.status(404).send();
                console.log('Short ' + name + ' not found');
                return;
            }
            
            console.log('Redirecting ' + name + ' to ' + short.url);
            res.redirect(short.url);
        } catch(err) {
            res.status(500).send('Internal Server Error');
            console.log(err);
        }
    });

    app.post('/short', async (req, res) => {
        try {
            const name = req.query.name;
            if(!name) {
                res.status(400).json({message: 'name parameter missing'});
                return;
            }
            const url = req.query.url;
            if(!url) {
                res.status(400).json({message: 'url parameter missing'});
                return;
            }
    
            const short = new Short({ name: name, url: url });
            await short.save();
    
            res.status(201).send();        
        } catch(err) {
            res.status(500).send('Internal Server Error');
            console.log(err);
        }
    });

    app.delete('/short', async (req, res) => {
        try {
            const name = req.query.name;
            if(!name) {
                res.status(400).json({message: 'name parameter missing'});
                return;
            }

            await Short.deleteOne({ name: req.query.name });
            console.log('Deleted ' + name);
            res.status(204).send();
        } catch(err) {
            res.status(500).send('Internal Server Error');
            console.log(err);
        }
    });

    return app;
}