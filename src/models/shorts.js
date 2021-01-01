const mongoose = require('mongoose');

const shortsSchema = mongoose.Schema({

    id: {
        type: String,
        required: true,
        unique: true,
    },
    url: {
        type: String,
        required: true
    }

});

const Shorts = mongoose.model('Shorts', shortsSchema);

module.exports = Shorts;
