require('../models/Professionals');
require('../models/Applications');
require('../models/Bookings');
require('../models/SubCategory');
require('../models/Feedbacks');
require('../models/Payments');

const e = require('express');
var mongoose = require('mongoose');
const Razorpay = require('razorpay')
const Professional = mongoose.model('Professional');
const Application = mongoose.model('Applications');
const Booking = mongoose.model('Booking');
const Payment = mongoose.model('Payment');
const SubCategory = mongoose.model('SubCategory');
const Feedback = mongoose.model('Feedback');

// PROFESSIONAL DASHBOARD CONTROLLERS //
exports.professionalDetails = function (req, res) {
    const professional_id = req.userId;
    Professional.findById(
        { _id: professional_id },
        function (err, professional) {
            if (professional) {
                console.log(professional)
                return res.status(200).json({
                    professional
                })
            } else if (!professional) {
                return res.status(200).json({
                    message: "Access Denied. Please Login",
                    professional
                })
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Something went wrong. Please try again later"
                })
            }
        })

}
// HOME TAB - ROUTES //
exports.acceptedServices = function (req, res) {
    const professional_id = req.params.professionalId
    Professional.findById(
        { _id: professional_id },
        function (err, professional) {
            if (professional) {
                Booking.find(
                    {
                        'professional_id': professional._id,
                        $nor: [{ service_status: "Service Cancelled" }, { service_status: "Payment done" }]
                    },
                    function (err, bookings) {
                        if (bookings) {
                            console.log(bookings)
                            return res.status(200).json({
                                Bookings: bookings
                            })
                        } else if (!bookings) {
                            console.log(bookings)
                            return res.status(200).json({
                                message: "You don't have any accepted services yet."
                            })
                        } else {
                            console.log(err)
                            return res.status(500).json({
                                error: "Something went wrong. Please try again later"
                            })
                        }
                    })
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Something went wrong. Please try again later"
                })
            }
        }
    )
}

exports.sendAddOnsList = function (req, res) {
    const professional_id = req.params.professionalId
    Professional.findById(
        { _id: professional_id },
        function (err, professional) {
            if (professional) {
                SubCategory.find({ profession: professional.profession_type }, function (err, subCategory) {
                    if (subCategory) {
                        console.log("Sub Category available");
                        return res.status(200).json({
                            subCategory: subCategory
                        })
                    } else {
                        return res.status(500).json({
                            error: "Something went wrong. Please try after sometime."
                        });
                    }
                })
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Something went wrong. Please try again later"
                })
            }
        })
}

exports.updateService = function (req, res) {
    const professional_id = req.params.professionalId
    Professional.findById(
        { _id: professional_id },
        function (err, professional) {
            if (professional) {
                const bookingId = req.params.bookingId;
                const status = req.body.service_status;
                const addons = req.body.add_ons;
                const total = req.body.total_price;
                Booking.findByIdAndUpdate(
                    { _id: bookingId },
                    {
                        $set: {
                            "service_status": status,
                            "add_ons": addons,
                            "total_price": total
                        }
                    },
                    function (err, booking) {
                        if (booking) {
                            if (status == "Work completed") {
                                payment = new Payment({ bookingId: booking._id });
                                payment.set({
                                    'customerId': booking.customer_id,
                                    'professionalId': booking.professional_id,
                                    'total_amount': booking.total_price,
                                    'customer_phone': booking.customer_phone,
                                    'professional_phone': booking.professional_phone,
                                    'payment_status': "PENDING",
                                    "service_completed_at": Date.now()
                                });
                                payment.save(function (err) {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).json({
                                            error: "Something went wrong. Please try again later"
                                        });
                                    } else {
                                        console.log(payment);
                                        console.log(booking);
                                        booking.set({
                                            'payment_id': payment._id,
                                            'payment_status': "PENDING"
                                        })
                                        booking.save();
                                        return res.status(200).json({
                                            message: "Service details updated, please proceed to payment."
                                        });
                                    }
                                })
                            } else {
                                console.log(booking);
                                return res.status(200).json({
                                    message: "Service details updated successfully."
                                })
                            }
                        } else {
                            console.log(err);
                            return res.status(500).json({
                                error: "Something went wrong. Please try again later"
                            });
                        }
                    }
                )
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Something went wrong. Please try again later"
                })
            }
        }
    )
}



// NEW REQUESTS TAB - ROUTES //
exports.fetchServiceRequests = function (req, res) {
    const professional_id = req.params.professionalId
    Professional.findById(
        { _id: professional_id },
        // { $set: { "service_requests": [] } },
        function (err, professional) {
            if (professional) {
                const profession = professional.profession_type;
                const city = professional.personal_details.city;
                var serviceRequests = professional.service_requests
                console.log(serviceRequests)
                Booking.find({})
                    .where({
                        'profession_type': profession,
                        'service_address.city': city,
                        'professional_name': null,
                        '_id': { "$nin": serviceRequests.map(sr => sr.booking_id) }
                    })
                    .then(function (Bookings) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                error: "Something went wrong. Please try again later"
                            });
                        } else if (!Bookings) {
                            return res.status(500).json({
                                message: "No requests available at the moment."
                            });
                        } else {
                            console.log(Bookings);
                            return res.status(200).json({
                                bookings: Bookings
                            })
                        }
                    }
                    )
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Something went wrong. Please try again later"
                })
            }
        })
}

exports.takeServiceAction = function (req, res) {
    const professional_id = req.params.professionalId
    const sr = req.body
    Professional.findByIdAndUpdate(
        { _id: professional_id },
        { $push: { service_requests: sr } },
        function (err, professional) {
            if (professional) {
                if (sr.action_taken == "Accepted") {
                    Booking.findById(
                        { _id: sr.booking_id },
                        function (err, booking) {
                            if (booking) {
                                if (booking.professional_id == null) {
                                    booking.set({
                                        'professional_id': professional._id,
                                        'professional_name': professional.name,
                                        'professional_image': professional.profile_image,
                                        'professional_type': professional.profession_type,
                                        'professional_phone': professional.phone,
                                        'service_status': "Professional Appointed"
                                    })
                                    booking.save(function (err) {
                                        if (err) {
                                            console.log(err)
                                            return res.status(500).json({ error: "Something went wrong. Please try again." });
                                        } else {
                                            console.log(professional);
                                            console.log(booking);
                                            return res.status(200).json({
                                                message: "Service Request accepted. You can now see the complete details of the service."
                                            })
                                        }
                                    })
                                } else {
                                    console.log(booking)
                                    return res.status(500).json({
                                        message: "You cannot accept the service now. Someone else may have booked it."
                                    })
                                }
                            } else {
                                console.log(err)
                                return res.status(500).json({
                                    error: "Something went wrong. Please try again later"
                                })
                            }
                        })
                } else if (sr.action_taken == "Rejected") {
                    console.log(professional)
                    return res.status(200).json({
                        message: "Successfull marked service action as : " + sr.action_taken
                    });
                }
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Something went wrong. Please try again later"
                })
            }
        })
}



// HISTORY TAB - ROUTES //
exports.getBookingHistory = function (req, res) {
    const professional_id = req.params.professionalId
    Professional.findById(
        { _id: professional_id },
        function (err, professional) {
            if (professional) {
                Booking.find(
                    {
                        'professional_id': professional._id,
                        $or: [{ service_status: "Service Cancelled" }, { service_status: "Payment done" }]
                    },
                    function (err, bookings) {
                        if (bookings) {
                            console.log(bookings)
                            Feedback.find(
                                { professional_id: professional_id },
                                function (err, feedbacks) {
                                    if (err) {
                                        console.log(err)
                                        return res.status(500).json({
                                            error: "Something went wrong. Please try again later"
                                        })
                                    } else {
                                        console.log(feedbacks)
                                        return res.status(200).json({
                                            Bookings: bookings,
                                            Feedbacks: feedbacks
                                        })
                                    }
                                }
                            )
                        } else if (!bookings) {
                            console.log(bookings)
                            return res.status(200).json({
                                message: "You don't have any completed services yet."
                            })
                        } else {
                            console.log(err)
                            return res.status(500).json({
                                error: "Something went wrong. Please try again later"
                            })
                        }
                    })
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Something went wrong. Please try again later"
                })
            }
        }
    )
}



// APPLICATION FORM TAB - ROUTES //
exports.submitIdentityVerification = function (req, res) {
    const professional_id = req.params.professionalId
    Professional.findById({ _id: professional_id }, function (err, professional) {
        if (professional) {
            const identityVerify = {
                "pancard_image": req.pancard,
                "aadhar_front": req.aadharfront,
                "aadhar_back": req.aadharback,
                "address_proof": req.addressproof
            }
            professional.set("identity_proof", identityVerify)
            professional.save(function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ error: "Something went wrong. Please try again." });
                } else {
                    console.log(professional);
                    return res.status(200).json({
                        message: "Identity details added succeefully."
                    })
                }
            })
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Cannot add details. Please try again later"
            })
        }
    })
}

exports.submitPersonalDetails = function (req, res) {
    const professional_id = req.params.professionalId
    Professional.findById({ _id: professional_id }, function (err, professional) {
        if (professional) {
            const professional_details = req.body;
            professional.set("personal_details", professional_details)
            professional.save(function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ error: "Something went wrong. Please try again." });
                } else {
                    console.log(professional);
                    return res.status(200).json({
                        message: "Personal details added succeefully."
                    })
                }
            })
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Cannot add details. Please try again later"
            })
        }
    })
}

exports.submitBankDetails = function (req, res) {
    const professional_id = req.params.professionalId
    Professional.findById({ _id: professional_id }, function (err, professional) {
        if (professional) {
            const bank_details = {
                "accountholder_name": req.body.accountholder_name,
                "account_number": req.body.account_number,
                "ifsc_code": req.body.ifsc_code,
                "cancelled_cheque": req.cancelledCheque,
            }
            console.log(bank_details)
            professional.set("bank_details", bank_details)
            professional.save(function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ error: "Something went wrong. Please try again." });
                } else {
                    console.log(professional);
                    return res.status(200).json({
                        message: "Bank details added succeefully."
                    })
                }
            })
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Cannot add details. Please try again later"
            })
        }
    })
}

exports.submitAttachPhotos = function (req, res) {
    const professional_id = req.params.professionalId
    Professional.findById({ _id: professional_id }, function (err, professional) {
        if (professional) {
            const attachments = [
                req.att_1,
                req.att_2,
                req.att_3,
                req.att_4,
                req.att_5,
                req.att_6,
            ]
            professional.set("attachments", attachments)
            professional.save(function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ error: "Something went wrong. Please try again." });
                } else {
                    console.log(professional);
                    return res.status(200).json({
                        message: "Attachments added succeefully."
                    })
                }
            })
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Cannot add details. Please try again later"
            })
        }
    })
}

exports.submitApplication = function (req, res) {
    const professional_id = req.params.professionalId
    Professional.findById({ _id: professional_id }, function (err, professional) {
        if (professional) {
            professional.set('status', "Pending for approval")
            professional.save(function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ error: "Something went wrong. Please try again." });
                } else {
                    const application = new Application({ phone: professional.phone })
                    application.set({
                        'professionalId': professional._id,
                        'name': professional.name,
                        'email': professional.email,
                        'profession_type': professional.profession_type,
                        'profile_image': professional.profile_image,
                        'status': professional.status,
                        'personal_details': professional.personal_details,
                        'identity_proof': professional.identity_proof,
                        'bank_details': professional.bank_details,
                        'attachments': professional.attachments
                    })
                    application.save(function (err) {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({ error: "Something went wrong. Please try again." });
                        } else {
                            console.log(professional);
                            console.log(application);
                            return res.status(200).json({
                                message: "Application submitted successfully. You will start recieving service once your application gets approved."
                            })
                        }
                    })
                }
            })
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Cannot add details. Please try again later"
            })
        }
    })
}

exports.resubmitApplication = function (req, res) {
    const professional_id = req.params.professionalId
    Professional.findById({ _id: professional_id }, function (err, professional) {
        if (professional) {
            professional.set('status', "Not Submitted")
            professional.save(function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ error: "Something went wrong. Please try again." });
                } else {
                    Application.findOneAndUpdate(
                        { professionalId: professional_id },
                        { $set: { "status": "Not Submitted" } },
                        function (err, statusUpdated) {
                            if (err) {
                                console.log(err)
                                return res.status(500).json({
                                    error: "Cannot resubmit. Please try again later"
                                })
                            } else {
                                return res.status(200).json({
                                    message: "You can now resubmit the application."
                                })
                            }
                        }
                    )
                }
            })
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Cannot add details. Please try again later"
            })
        }
    })
}


// PROFESSIONAL UPDATE MENU - ROUTES //
exports.uploadProfileImage = function (req, res) {
    Professional.findByIdAndUpdate(
        { _id: req.params.professionalId },
        {
            $set: {
                'profile_image': req.profileImage
            }
        })
        .then(function (professional, err) {
            if (professional) {
                const profile_image = req.profileImage;
                return res.status(200).json({
                    message: "Profile image updated successfully.",
                    profile_image
                })
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Connot update user profile image. Please try again later"
                })

            }
        })
}

exports.updateProfessional = function (req, res) {
    Professional.findByIdAndUpdate(
        { _id: req.params.professionalId },
        {
            "$set": {
                "name": req.body.name,
                "email": req.body.email,
                "about": req.body.about
            }
        })
        .then(function (professional, err) {
            if (professional) {
                return res.status(200).json({
                    message: "User details updated successfully."
                })
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Cannot update user details. Please try again later"
                })
            }
        })
}
