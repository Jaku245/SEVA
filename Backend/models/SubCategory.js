var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

var subCategorySchema = new mongoose.Schema({
    categoryId: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    categoryName: {
        type : String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        maxLength: 50
    },
    display_image: {
        type: String,
    },
    about: {
        type: String,
        maxLength: 200
    },
    services: [
        {
            name: {
                type: String,
                required: true,
                maxLength: 100
            },
            display_image: {
                type: String,
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
        }
    ]
},
    { additionalItems: true }
)


mongoose.model('SubCategory', subCategorySchema)