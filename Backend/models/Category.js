var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profession_type: {
        type: String,
        required: true
    },
    display_image: {
        type: String,
        required: true
    },
    about: {
        type: String,
        maxLength: 200,
        required: true
    }
})

mongoose.model('Category', categorySchema)