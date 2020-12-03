require('../models/Bookings');

const e = require('express');
var mongoose = require('mongoose');
const Booking = mongoose.model('Booking');

module.exports = (req, res, next) => {
    const bid = req.params.bookingId;
    Booking
        .findById({ _id: bid })
        .then(function (booking) {

            const receiptId = JSON.stringify(booking.payment_id);
            const professionalId = JSON.stringify(booking.professional_id);
            // console.log(receiptId);

            // SPLIT PHONE NO //
            var str = booking.customer_phone;
            var rs = str.split("-");
            var phoneNo = rs[1];

            // CREATE ITEMS ARRAY //
            const servicedetails = [];
            for (let index = 0; index < booking.service_details.length; index++) {
                const item = {
                    "name": booking.service_details[index].service_name,
                    "quantity": booking.service_details[index].quantity,
                    "amount": booking.service_details[index].price * 100,
                }
                servicedetails[index] = item;
            }
            const addonslist = [];
            for (let index = 0; index < booking.add_ons.length; index++) {
                const item = {
                    "name": booking.add_ons[index].service_name,
                    "quantity": booking.add_ons[index].quantity,
                    "amount": booking.add_ons[index].price * 100,
                }
                addonslist[index] = item;
            }
            const items = [
                ...servicedetails,
                ...addonslist,
                {
                    "name": "Convenience Fees",
                    "description": "Non Refundable",
                    "amount": 5000,
                    "quantity": 1
                }
            ]
            // console.log(items);

            // EXPIRY TIMESTAMP //
            var currentUnixTime = Math.round((new Date()).getTime() / 1000);
            // console.log(currentUnixTime);
            var expiryTime = currentUnixTime + 1000;
            // console.log(expiryTime);

            // CREATE DETAILS PARAMATER TO PASS //
            const details =
            {
                "type": "invoice",
                "description": 'Invoice for service ID : #' + bid,
                "customer": {
                    "name": booking.customer_name,
                    "contact": phoneNo,
                    "email": booking.customer_email
                },
                "line_items": items,
                "sms_notify": 1,
                "email_notify": 1,
                "expire_by": expiryTime,
                "receipt": receiptId,
                "notes": {
                    "Professional Id" : professionalId,
                    "Profession" : booking.profession_type,
                    "Professional Name" : booking.professional_name,
                    "Professional Phone" : booking.professional_phone
                }
            }
            req.details = details;
            console.log(req.details)
            console.log("Details generated.")
            next();
        })
        .catch((error) => {
            console.log(error)
            return res.status(400).json({
                error,
                err: "Something went wrong. Please try again later."
            })
        })
}