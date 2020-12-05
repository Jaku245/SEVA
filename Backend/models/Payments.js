var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

var paymentSchema = new mongoose.Schema({
    bookingId: {
        type: ObjectId,
        required: true,
        ref: 'Booking'
    },
    customerId: {
        type: ObjectId,
        required: true,
        ref: 'Customer'
    },
    professionalId: {
        type: ObjectId,
        required: true,
        ref: 'Professional'
    },
    total_amount: {
        type: Number,
        required: true
    },
    customer_phone: {
        type: String,
        required: true
    },
    professional_phone: {
        type: String,
        required: true
    },
    payment_status: {
        type: String,
        enum: [
            "PENDING",
            "INITIATED",
            "SUCCESS",
            "FAILED"
        ],
        required: true
    },
    service_completed_at: {
        type: Date,
        required: true
    },
    payment_mode: {
        type: String,
        enum: [
            "ONLINE",
            "OFFLINE",
        ]
    },
    online: [{
        invoiceId: {
            type: String,
            index: {
                unique: true,
                partialFilterExpression: { invoiceId: { $exists: true } }
            }

        },
        orderId: {
            type: String,
            index: {
                unique: true,
                partialFilterExpression: { orderId: { $exists: true } }
            }
        },
        paymentId: {
            type: String,
            index: {
                unique: true,
                partialFilterExpression: { paymentId: { $exists: true } }
            }
        },
        online_status: {
            type: String,
            enum: [
                "draft",
                "issued",
                "paid",
                "cancelled",
                "expired"
            ]
        }
    }],
    offline: {
        offline_status: {
            type: String,
            enum: [
                "pending",
                "initiated",
                "success",
                "cancelled"
            ]
        }
    },
    payment_completed_at: {},
},
    { timestamps: true }
)

mongoose.model('Payment', paymentSchema);
