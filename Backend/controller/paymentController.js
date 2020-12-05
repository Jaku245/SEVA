require('../models/Professionals');
require('../models/Bookings');
require('../models/Payments');

var config = require('../config');

const e = require('express');
var mongoose = require('mongoose');
const Razorpay = require('razorpay')
const Booking = mongoose.model('Booking');
const Payment = mongoose.model('Payment');

let rzp = new Razorpay({
    key_id: config.RAZOR_ID, // your `KEY_ID`
    key_secret: config.RAZOR_SECRET // your `KEY_SECRET`
})

// ONLINE PAYMENT ROUTES //
exports.generatePaymentLink = function (req, res) {
    const bid = req.params.bookingId;
    const details = req.details;
    rzp.invoices
        .create(details)
        .then((data) => {
            console.log(data);
            console.log("Invoice issued successfully");
            const pushOnlineDetails = {
                'invoiceId': data.id,
                'orderId': data.order_id,
                'online_status': data.status
            }
            Payment.findOneAndUpdate(
                { bookingId: bid },
                {
                    $set: {
                        'payment_mode': "ONLINE",
                        'payment_status': "INITIATED"
                    },
                    $push: {
                        online: pushOnlineDetails
                    }
                },
                function (err, payment) {
                    if (payment) {
                        console.log(payment);
                        Booking.findByIdAndUpdate(
                            { _id: bid },
                            {
                                $set: {
                                    'payment_status': "INITIATED",
                                    'payment_mode': "ONLINE"
                                }
                            },
                            function (err, booking) {
                                if (booking) {
                                    console.log(booking);
                                    const id = data.id;
                                    return res.status(200).json({
                                        message: "Payment link sent, Waiting for confirmation.",
                                        invoiceId: id,
                                        status: "INITIATED"
                                    })
                                } else {
                                    console.log(err)
                                    return res.status(400).json({
                                        error: "Something went wrong. Please try again later."
                                    })
                                }
                            }
                        )
                    } else {
                        console.log(err)
                        return res.status(400).json({
                            error: "Something went wrong. Please try again later."
                        })
                    }
                }
            )
        })
        .catch((error) => {
            console.log(error)
            return res.status(400).json({
                error: "Something went wrong. Please try again later."
            })
        })
}
exports.fetchPaymentStatus = function (req, res) {
    const bid = req.params.bookingId;
    const id = req.body.invoiceId;
    rzp.invoices.fetch(id).then((data) => {
        // console.log(data)
        if (data.status == "paid") {
            Payment.findOneAndUpdate({ bookingId: bid },
                {
                    $set: {
                        'online.$[element].online_status': data.status,
                        'online.$[element].paymentId': data.payment_id,
                        'payment_status': "SUCCESS",
                        'payment_mode': "ONLINE"
                    }
                },
                { arrayFilters: [{ 'element.invoiceId': id }], multi: true },
                function (err, payment) {
                    if (payment != null) {
                        console.log(payment)
                        Booking.findByIdAndUpdate({ _id: bid },
                            {
                                $set: { 'payment_status': "SUCCESS", 'payment_mode': "ONLINE", 'service_status': "Payment done" }
                            },
                            function (err, booking) {
                                console.log(booking);
                                return res.status(200).json({
                                    message: "Confirmation recieved from RazorPay. Payment Recieved.",
                                    status: "PAID"
                                })
                            })
                    } else {
                        console.log(err)
                        return res.status(400).json({
                            error: "Something went wrong. Please try again later."
                        })
                    }
                }
            )
        }
        else if (data.status == "expired") {
            Payment.findOneAndUpdate({ bookingId: bid },
                {
                    $set: {
                        'online.$[element].online_status': data.status,
                        'payment_status': "PENDING"
                    },
                    $unset: { 'payment_mode': "" }
                },
                { arrayFilters: [{ 'element.invoiceId': id }], multi: true },
                function (err, payment) {
                    if (payment != null) {
                        console.log(payment)
                        Booking.findByIdAndUpdate({ _id: bid },
                            {
                                $set: { 'payment_status': "PENDING" },
                                $unset: { 'payment_mode': "" }
                            },
                            function (err, booking) {
                                console.log(booking);
                                return res.status(200).json({
                                    message: "Payment link expired, please generate a new payment link.",
                                    status: "EXPIRED"
                                })
                            })
                    } else {
                        console.log(err)
                        return res.status(500).json({
                            error: "Something went wrong. Please try again later."
                        })
                    }
                })
        }
        else {
            console.log(data)
            return res.status(200).json({
                message: "Recieved unwanted response. Please check the status on RazorPay.",
                status: data.status
            })
        }
    })
        .catch((error) => {
            console.log(error)
            return res.status(500).json({
                error: "Something went wrong. Please try again later."
            })
        })

}
exports.cancelOnlinePayment = function (req, res) {
    const bid = req.params.bookingId;
    const id = req.body.invoiceId;
    rzp.invoices
        .cancel(id)
        .then((data) => {
            console.log(data);
            console.log("Invoice Cancelled.")
            Booking.findOneAndUpdate(
                { _id: bid },
                { $set: { 'payment_status': "PENDING" }, $unset: { 'payment_mode': "" } },
                function (err, booking) {
                    if (booking != null) {
                        console.log("Booking Updated")
                        Payment.findOneAndUpdate(
                            { bookingId: bid },
                            {
                                $set: {
                                    'online.$[element].online_status': data.status,
                                    'payment_status': "PENDING"
                                },
                                $unset: { 'payment_mode': "" }
                            },
                            { arrayFilters: [{ 'element.invoiceId': id }], multi: true },
                            function (err, pay) {
                                if (pay != null) {
                                    console.log("Payment updated");
                                    return res.status(200).json({
                                        message: "Online payment cancelled, payment pending.",
                                        status: "PENDING"
                                    });
                                } else {
                                    console.log(err);
                                    return res.status(400).json({
                                        error: "Something went wrong. Please try again later."
                                    });
                                }
                            }
                        )
                    } else {
                        console.log(err);
                        return res.status(400).json({
                            error: "Something went wrong. Please try again later."
                        });
                    }
                }
            )
        })
        .catch((error) => {
            console.log(error)
            return res.status(400).json({
                error: "Something went wrong. Please try again later."
            })
        });
}
exports.resendNotification = function (req, res) {
    const id = req.body.invoiceId;
    rzp.invoices
        .notifyBy(id, "sms")
        .then((data) => {
            console.log(data);
            return res.status(200).json({
                message: "Invoice link sent again. Waiting for confirmation"
            })
        })
        .catch((error) => {
            console.log(error)
            return res.status(400).json({
                error: "Something went wrong. Please try again later."
            })
        })
}

// OFFLINE PAYMENT ROUTES //
exports.initiateCash = function (req, res) {
    const bid = req.params.bookingId;
    Payment.findOne(
        { bookingId: bid },
        function (err, payment) {
            const offline = {
                'offline_status': "initiated"
            }
            payment.set('offline', offline);
            payment.set('payment_mode', "OFFLINE");
            payment.set('payment_status', "INITIATED");
            payment.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        err: "Something went wrong. Please try again later."
                    })
                } else {
                    console.log(payment);
                    Booking.findByIdAndUpdate(
                        { _id: bid },
                        {
                            $set: {
                                'payment_status': "INITIATED",
                                'payment_mode': "OFFLINE"
                            }
                        },
                        function (err, booking) {
                            if (err) {
                                console.log(err);
                                return res.status(400).json({
                                    err: "Something went wrong. Please try again later."
                                })
                            } else {
                                console.log(booking);
                                return res.status(200).json({
                                    message: "Cash payment initiated, Waiting for confirmation.",
                                    status: "INITIATED"

                                })
                            }
                        }
                    )
                }
            })
        }
    )
}
exports.confirmCash = function (req, res) {
    const bid = req.params.bookingId;
    Payment.findOne(
        { bookingId: bid },
        function (err, payment) {
            const offline = {
                'offline_status': "success"
            }
            payment.set('offline', offline);
            payment.set('payment_status', "SUCCESS");
            payment.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        err: "Something went wrong. Please try again later."
                    })
                } else {
                    console.log(payment);
                    Booking.findByIdAndUpdate(
                        { _id: bid },
                        {
                            $set: {
                                'payment_status': "SUCCESS",
                                'payment_mode': "OFFLINE",
                                'service_status': "Payment done"
                            }
                        },
                        function (err, booking) {
                            if (err) {
                                console.log(err);
                                return res.status(400).json({
                                    err: "Something went wrong. Please try again later."
                                })
                            } else {
                                console.log(booking);
                                return res.status(200).json({
                                    message: "Cash payment successfull, you can now leave the location.",
                                    status: "PAID"
                                })
                            }
                        }
                    )
                }
            })
        }
    )
}
exports.cancelCash = function (req, res) {
    const bid = req.params.bookingId;
    const offline = {
        'offline_status': "cancelled"
    }
    Payment.findOneAndUpdate(
        { bookingId: bid },
        {
            $set: {
                'offline': offline,
                'payment_status': "PENDING"
            },
            $unset: {
                'payment_mode': ""
            }
        },
        function (err, payment) {
            console.log(payment);
            Booking.findByIdAndUpdate(
                { _id: bid },
                {
                    $set: {
                        'payment_status': "PENDING"
                    },
                    $unset: {
                        'payment_mode': ""
                    }
                },
                function (err, booking) {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({
                            err: "Something went wrong. Please try again later."
                        })
                    } else {
                        console.log(booking);
                        return res.status(200).json({
                            message: "Cash payment cancelled, payment pending.",
                            status: "PENDING"
                        })
                    }
                }
            )
        }
    )
}