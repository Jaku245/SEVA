var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

var feedbackSchema = new mongoose.Schema({
    customer_id: {
        type: ObjectId,
        ref: 'Customer',
        required: true
    },
    professional_id: {
        type: ObjectId,
        ref: 'Professional'
    },
    booking_id: {
        type: ObjectId,
        ref: 'Booking'
    },
    professional_feedback: {
        type: String,
        maxLength: 3000
    },
    professional_ratings: {
        type: Number
    }
},
    { timestamps: true }
)

mongoose.model('Feedback', feedbackSchema);