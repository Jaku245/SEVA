require('../models/Admins');
require('../models/Customers');
require('../models/Professionals');
require('../models/Applications')
require('../models/Bookings')

var mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const Customer = mongoose.model('Customer');
const Professional = mongoose.model('Professional');
const Booking = mongoose.model('Booking');
const Applications = mongoose.model('Applications');

// ADMIN DASHBOARD CONTROLLERS //
exports.adminDetails = function (req, res) {
    const admin_id = req.userId;
    Admin.findById(
        { _id: admin_id },
        function (err, admin) {
            if (admin) {
                console.log(admin)
                return res.status(200).json({
                    admin
                })
            } else if (!admin) {
                return res.status(200).json({
                    message: "Access Denied. Please Login",
                })
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Something went wrong. Please try again later"
                })
            }
        })
}

// MANAGE APLLICATIONS TAB - ROUTES //
exports.fetchApplications = function (req, res) {
    const adminId = req.params.adminId;
    Applications
        .find({})
        .where({
            'status': "Pending for approval"
        })
        .then(function (newApplications) {
            if (newApplications) {
                console.log(newApplications);
                // return res.status(200).json({
                //     newApplications
                // });
                Applications
                    .find({})
                    .where({
                        'status': "Application Approved",
                        'actionTakenBy': adminId
                    })
                    .then(function (acceptedApplications) {
                        if (acceptedApplications) {
                            console.log(acceptedApplications);
                            Applications
                                .find({})
                                .where({
                                    'status': "Application Rejected",
                                    'actionTakenBy': adminId
                                })
                                .then(function (rejectedApplications) {
                                    if (rejectedApplications) {
                                        console.log(rejectedApplications);
                                        return res.status(200).json({
                                            newApplications,
                                            acceptedApplications,
                                            rejectedApplications
                                        })
                                    }
                                })
                                .catch(error => {
                                    console.log(error.message)
                                    return res.status(500).json({
                                        error: "Something went wrong. Please try again later."
                                    });
                                })
                        }
                    })
                    .catch(error => {
                        console.log(error.message)
                        return res.status(500).json({
                            error: "Something went wrong. Please try again later."
                        });
                    })
            }
        })
        .catch(error => {
            console.log(error.message)
            return res.status(500).json({
                error: "Something went wrong. Please try again later."
            });
        })
}
exports.takeActionApplications = function (req, res) {
    const adminId = req.params.adminId;
    const appId = req.params.applicationId;
    Applications.findOneAndUpdate(
        {
            _id: appId,
            'status': "Pending for approval"
        },
        {
            'status': req.body.action,
            'actionTakenBy': adminId
        },
        function (err, application) {
            if (application) {
                console.log(application);
                return res.status(200).json({
                    message: "Action taken successfully. The professional will be notified."
                })
            } else {
                console.log(err);
                return res.status(500).json({
                    error: "Something went wrong. Please try again."
                })
            }
        })
}

// MANAGE CUSTOMERS - ROUTES //
exports.fetchCustomers = function (req, res) {
    Customer.find(function (err, customers) {
        if (customers != null) {
            console.log(customers)
            return res.status(200).json({
                customers
            })
        } else if (customers == null) {
            console.log(customers)
            return res.status(200).json({
                message: "No customers available."
            })
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Something went wrong. Please try after sometime."
            });
        }
    })
}
exports.flagCustomer = function (req, res) {
    const customerId = req.params.customerId;
    const adminId = req.params.adminId;
    Customer.findByIdAndUpdate(
        {
            _id: customerId
        },
        {
            "$set": {
                "isFlagged": true,
                "isFlaggedBy": adminId,
                "token": ''
            }
        },
        function (err, customer) {
            if (customer) {
                return res.status(200).json({
                    message: "Customer has been flgged successfully."
                })
            }
            else {
                console.log(err)
                return res.status(500).json({
                    error: "Something went wrong. Please try after sometime."
                });
            }
        }
    )
}
exports.viewCustomer = function (req, res) {
    const customerId = req.params.customerId;
    Customer
        .findOne({})
        .where({
            _id: customerId,
        })
        .then(function (customer) {
            if (customer != null) {
                Booking
                    .find({})
                    .where({
                        'customer_id': customerId
                    })
                    .then(function (bookings) {
                        if (bookings) {
                            console.log(customer)
                            console.log(bookings)
                            return res.status(200).json({
                                customer,
                                bookings
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error.message)
                        return res.status(500).json({
                            error: "Something went wrong. Please try again later."
                        });
                    })
            } else {
                console.log(error.message)
                return res.status(500).json({
                    error: "Something went wrong. Please try again later."
                });
            }
        })
}

// MANAGE PROFESSIONALS - ROUTES //
exports.fetchProfessionals = function (req, res) {
    Professional.find(function (err, professionals) {
        if (professionals != null) {
            console.log(professionals)
            return res.status(200).json({
                professionals
            })
        } else if (professionals == null) {
            console.log(professionals)
            return res.status(200).json({
                message: "No professionals available."
            })
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Something went wrong. Please try after sometime."
            });
        }
    })
}
exports.flagProfessional = function (req, res) {
    const professionalId = req.params.professionalId;
    const adminId = req.params.adminId;
    Professional.findByIdAndUpdate(
        {
            _id: professionalId
        },
        {
            "$set": {
                "isFlagged": true,
                "isFlaggedBy": adminId,
                "token": ''
            }
        },
        function (err, professional) {
            if (professional) {
                return res.status(200).json({
                    message: "Professional has been flgged successfully."
                })
            }
            else {
                console.log(err)
                return res.status(500).json({
                    error: "Something went wrong. Please try after sometime."
                });
            }
        }
    )
}
exports.viewProfessional = function (req, res) {
    const professionalId = req.params.professionalId;
    Professional
        .findOne({})
        .where({
            _id: professionalId,
        })
        .then(function (professional) {
            if (professional != null) {
                Booking
                    .find({})
                    .where({
                        'professional_id': professionalId
                    })
                    .then(function (bookings) {
                        if (bookings) {
                            console.log(professional)
                            console.log(bookings)
                            return res.status(200).json({
                                professional,
                                bookings
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error.message)
                        return res.status(500).json({
                            error: "Something went wrong. Please try again later."
                        });
                    })
            } else {
                console.log(error.message)
                return res.status(500).json({
                    error: "Something went wrong. Please try again later."
                });
            }
        })
}

// VIEW REPORTS & BOOKINGS - ROUTE //
exports.fetchBookings = function (req, res) {
    Booking.find(function (err, bookings) {
        if (bookings != null) {
            console.log(bookings)
            return res.status(200).json({
                bookings
            })
        } else if (bookings == null) {
            console.log(bookings)
            return res.status(200).json({
                message: "No bookings available."
            })
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Something went wrong. Please try after sometime."
            });
        }
    })
}