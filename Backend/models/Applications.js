var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const { default: validator } = require('validator');

var applicationSchema = new mongoose.Schema({
    professionalId: {
        type: ObjectId,
        ref: 'Professional',
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    profession_type: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Not Submitted", "Pending for approval", "Application Approved", "Application Rejected"],
        required: true
    },
    actionTakenBy: {
        type: String
    },
    personal_details: {
        name: {
            type: String,
            required: true,
        },
        aadhar_number: {
            type: String,
            index: {
                unique: true,
                partialFilterExpression: { aadhar_number: { $exists: true } }
            },
            required: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true,
        },
        date_of_birth: {
            type: Date,
            required: true,
        },
        care_of: {
            type: String,
            required: true,
        },
        address_details1: {
            type: String,
            required: true,
        },
        address_details2: {
            type: String,
            required: true,
        },
        pincode: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        }
    },
    identity_proof: {
        pancard_image: {
            type: String,
            required: true
        },
        aadhar_front: {
            type: String,
            required: true,
        },
        aadhar_back: {
            type: String,
            required: true,
        },
        address_proof: {
            type: String,
            required: true,
        }
    },
    bank_details: {
        accountholder_name: {
            type: String,
            required: true,
        },
        account_number: {
            type: Number,
            required: true,
        },
        ifsc_code: {
            type: String,
            required: true,
        },
        cancelled_cheque: {
            type: String,
            required: true,
        }
    },
    attachments: [
    ]
},
    { timestamps: true }
)

mongoose.model('Applications', applicationSchema);