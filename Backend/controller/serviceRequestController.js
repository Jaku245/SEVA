require('../models/Customers');
require('../models/Feedbacks')
require('../models/Bookings');

var mongoose = require('mongoose');

const Customer = mongoose.model('Customer');
const Professional = mongoose.model('Professional');
const Booking = mongoose.model('Booking');
const Feedback = mongoose.model('Feedback');

// REQUEST SERVICE CONTROLLERS //
exports.requestService = function (req, res) {
    Customer.findOne({ _id: req.params.customerId }).exec(function (err, customer) {
        if (customer) {
            const booking = new Booking({ customer_id: customer._id });
            booking.set({
                'customer_name': customer.name,
                'customer_phone': customer.phone,
                'customer_email': customer.email,
                'customer_image': customer.profile_image,
                'profession_type': req.body.profession_type,
                'service_date': req.body.service_date,
                'service_time': req.body.service_time,
                'total_price': req.body.total_price,
                'service_address': req.body.address,
                'service_details': req.body.service_details
            });
            booking.save(function (err, bookingDetail) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        error: "Something went wrong. Please try again."
                    });
                } else {
                    console.log(bookingDetail._id);
                    return res.status(200).json({
                        message: "Service request sent successfully.",
                        bookingDetails: bookingDetail
                    });
                }
            })
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Something went wrong. Please try again."
            });
        }
    })
}

exports.viewBookingDetails = function (req, res) {
    const bookingId = req.params.bookingId;
    const customerId = req.params.customerId;
    Booking.findOne({ _id: bookingId, customer_id: customerId }, function (err, booking) {
        if (booking) {
            Feedback.findOne({ booking_id: bookingId }, function (err, feedback) {
                console.log(booking);
                let professional_feedback = null;
                let professional_ratings = null;
                if (feedback) {
                    professional_feedback = feedback.professional_feedback;
                    professional_ratings = feedback.professional_ratings;
                }
                return res.status(500).json({
                    booking,
                    professional_feedback,
                    professional_ratings
                });
            })
        } else {
            console.log(err);
            return res.status(500).json({
                error: "Something went wrong.Please try again later."
            });
        }
    })
}

exports.rescheduleServiceRequest = function (req, res) {
    const bookingId = req.params.bookingId;
    const customerId = req.params.customerId;
    Booking.findOneAndUpdate(
        { _id: bookingId, customer_id: customerId },
        { "$set": { service_date: req.body.service_date, service_time: req.body.service_time } },
        function (err, bookingDetails) {
            if (bookingDetails) {
                return res.status(500).json({
                    message: "Your service has been successfully reschedule.",
                    bookingDetails
                });
            } else {
                console.log(err);
                return res.status(500).json({
                    error: "Something went wrong.Please try again later."
                });
            }
        })
}

exports.cancelServiceRequest = function (req, res) {
    const bookingId = req.params.bookingId;
    const customerId = req.params.customerId;
    Booking.updateOne(
        { _id: bookingId, customer_id: customerId },
        { "$set": { service_status: 'Service Cancelled' } },
        function (err, booking) {
            if (booking) {
                return res.status(500).json({
                    message: "Your service has been successfully cancelled."
                });
            } else {
                console.log(err);
                return res.status(500).json({
                    error: "Something went wrong.Please try again later."
                });
            }
        })
}

exports.viewBookings = function (req, res) {
    const customerId = req.params.customerId;
    Booking.find({ customer_id: customerId }, function (err, bookings) {
        if (bookings) {
            console.log(bookings);
            return res.status(500).json({
                bookings
            });
        } else {
            console.log(err);
            return res.status(500).json({
                error: "Something went wrong.Please try again later."
            });
        }
    })
}

exports.viewProfessional = function (req, res) {
    const professionalId = req.params.professionalId;
    Professional.findById({ _id: professionalId }, function (err, Professional) {
        if (Professional) {
            Feedback.find(
                { professional_id: professionalId },
                function (err, feedbacks) {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({
                            error: "Something went wrong. Please try again later"
                        })
                    } else {
                        Booking.countDocuments({})
                            .where({
                                professional_id: professionalId,
                                service_status: "Payment done"
                            })
                            .then(function (serviceCount) {
                                if (err) {
                                    console.log(err)
                                    return res.status(500).json({
                                        error: "Something went wrong. Please try again later"
                                    })
                                } else {
                                    console.log(feedbacks)
                                    console.log(serviceCount)
                                    return res.status(200).json({
                                        ServiceCount: serviceCount,
                                        Professional: Professional,
                                        Feedbacks: feedbacks
                                    })
                                }
                            })
                    }
                }
            )
        } else {
            console.log(err);
            return res.status(500).json({
                error: "Something went wrong.Please try again later."
            });
        }
    })
}

exports.giveFeedback = function (req, res) {
    Booking.findOne({
        _id: req.params.bookingId,
        customer_id: req.params.customerId,
        professional_id: req.params.professionalId
    }, function (err, booking) {
        if (booking) {
            const feedback = new Feedback({ customer_id: req.params.customerId })
            feedback.set({
                'customer_name' : booking.customer_name,
                'customer_image' : booking.customer_image,
                'professional_id': req.params.professionalId,
                'professional_name' : booking.professional_name,
                'professional_image' : booking.professional_image,
                'booking_id': req.params.bookingId,
                'professional_feedback': req.body.professional_feedback,
                'professional_ratings': req.body.professional_ratings
            })
            feedback.save(function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        error: "Something went wrong2. Please try again."
                    });
                } else {
                    return res.status(200).json({
                        message: "Customer feedback submitted."
                    });
                }
            })
        } else {
            console.log(err);
            return res.status(500).json({
                error: "Something went wrong1.Please try again later."
            });
        }
    })
}