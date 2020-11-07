var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const { default: validator } = require('validator');

var adminSchema = new mongoose.Schema({
    adminId: {
        type: String,
        unique: true,
        required: [true, 'Please provide a unique Admin-Id']
    },
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
    address: {
        address_detail1: {
            type: String,
        },
        address_detail2: {
            type: String,
        },
        pincode: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        }
    }
},
    { timestamps: true }
)

mongoose.model('Admin', adminSchema);