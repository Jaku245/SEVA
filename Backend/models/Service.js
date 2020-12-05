var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

var serviceSchema = new mongoose.Schema({
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory: {
        type: ObjectId,
        ref: 'SubCategory',
        required: true
    },
    name: {
        type: String,
        required: true,
        maxLength: 100
    },
    display_image: {
        type: String,
        required: true,
        unique: true
    },
    about: {
        type: String,
        maxlength: 200
    },
    price: {
        type: Number,        
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxlength: 3000
    }
},
    { additionalItems: true }
)

mongoose.model('Service', serviceSchema)