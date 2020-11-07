var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const { default: validator } = require('validator');

var professionalSchema = new mongoose.Schema({
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
    phone: {
        type: String,
        unique: true,
        required: [true, 'Please provide your phone number']
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
    status: {
        type: String,
        enum: ["Not Submitted", "Pending for approval", "Application Approved", "Application Rejected"],
        default: "Not Submitted"
    },
    isFlagged: {
        type: Boolean,
        default: false
    },
    isFlaggedBy: {
        type: String
    },
    profession_type: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        default: ''
    },
    about: {
        type: String
    },
    personal_details: {
        name: {
            type: String
        },
        aadhar_number: {
            type: String,
            index: {
                unique: true,
                partialFilterExpression: { aadhar_number: { $exists: true } }
            }
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"]
        },
        date_of_birth: {
            type: Date
        },
        care_of: {
            type: String
        },
        address_details1: {
            type: String
        },
        address_details2: {
            type: String
        },
        pincode: {
            type: Number
        },
        city: {
            type: String
        },
        state: {
            type: String
        }
    },
    identity_proof: {
        pancard_image: {
            type: String
        },
        aadhar_front: {
            type: String
        },
        aadhar_back: {
            type: String
        },
        address_proof: {
            type: String
        }
    },
    bank_details: {
        accountholder_name: {
            type: String
        },
        account_number: {
            type: Number
        },
        ifsc_code: {
            type: String
        },
        cancelled_cheque: {
            type: String
        }
    },
    attachments: [
    ],
    service_requests: [{
        booking_id: {
            type: ObjectId,
            index: {
                unique: true,
                partialFilterExpression: { booking_id: { $exists: true } }
            }
        },
        action_taken: {
            type: String,
            enum: ["Accepted", "Rejected", "Was Busy"]
        },
        reason: {
            type: String
        }
    }]
},
    { timestamps: true }
)

mongoose.model('Professional', professionalSchema);