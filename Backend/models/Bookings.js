var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

var bookingSchema = new mongoose.Schema({
    customer_id: {
        type: ObjectId,
        ref: 'Customer',
        required: true
    },
    customer_name: {
        type: String,
        required: true
    },
    customer_phone: {
        type: String,
        required: true
    },
    customer_email: {
        type: String,
        required: true
    },
    customer_image: {
        type: String,
        default: null
    },
    professional_id: {
        type: ObjectId,
        ref: 'Professional'
    },
    professional_name: {
        type: String,
    },
    professional_phone: {
        type: String
    },
    professional_image: {
        type: String,
        default: null
    },
    profession_type: {
        type: String,
        required: true
    },
    service_date: {
        type: String,
        required: true
    },
    service_time: {
        type: String,
        required: true
    },
    service_address: {
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
        }
    },
    service_status: {
        type: String,
        default: "Service Requested",
        enum: [
            "Service Requested",
            "Professional Appointed",
            "Professional on the way",
            "Professional on site",
            "Work in progress",
            "Work completed",
            "Payment done",
            "Service Cancelled"
        ]
    },
    service_details: {
        type: Array,
        items: [
            {
                service_id: {
                    type: ObjectId,
                    required: true
                },
                service_name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]

    },
    add_ons: {
        type: Array,
        required: false,
        items: [
            {
                service_id: {
                    type: ObjectId,
                    required: true
                },
                service_name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    total_price: {
        type: Number,
        required: true
    },
    payment_id: {
        type: ObjectId,
        ref: 'Payment'
    },
    payment_status: {
        type: String,
        enum: [
            "PENDING",
            "INITIATED",
            "SUCCESS",
            "FAILED"
        ]
    },
    payment_mode: {
        type: String,
        enum: [
            "ONLINE",
            "OFFLINE",
        ]
    }
},
    { timestamps: true }
)

mongoose.model('Booking', bookingSchema);