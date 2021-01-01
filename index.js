const app = require('./src/app');
require('dotenv').config();
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/shorts', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    console.log('Connection to database successful');
}).catch((err) => {
    console.error.bind(err, 'error');
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});