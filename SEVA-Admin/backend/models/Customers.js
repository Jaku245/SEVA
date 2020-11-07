var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const { default: validator } = require('validator');

var customerSchema = new mongoose.Schema({
    phone: {
        type: String,
        unique: true,
        required: [true, 'Please provide your phone numnber']
    },
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please enter your email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid Email']
    },
    authyId: {
        type: String,
        unique: true
    },
    token: {
        type: String,
        index: {
            unique: true,
            partialFilterExpression: { token: { $exists: true } }
        }
    },
    isFlagged: {
        type: Boolean,
        default: false
    },
    isFlaggedBy: {
        type: String
    },
    profile_image: {
        type: String
    },
    address_book: [
        {
            geometry: {
                type: {
                    type: String,
                    default: "Point"
                },
                coordinates: {
                    type: [Number],
                    index: "2dsphere"
                }
            },
            person_name: {
                type: String,
                required: true
            },
            address_detail1: {
                type: String,
                required: true
            },
            address_detail2: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            address_type: {
                type: String,
                required: true,
                enum: ["Work", "Home", "Other"]
            },
            default: {
                type: Boolean,
                default: "false"
            }
        }
    ]
},
    { timestamps: true }
)

mongoose.model('Customer', customerSchema);