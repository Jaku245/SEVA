require('../models/Customers');
require('../models/Professionals');

var mongoose = require('mongoose');
const Customer = mongoose.model('Customer');
const Professional = mongoose.model('Professional');

const jwt = require("jsonwebtoken");
var config = require('../config');
var authy = require('authy')(config.API_KEY);

const JWTtoken = (id) => jwt.sign({ id: id }, config.JWT_KEY);


// Customer Login
exports.customerLogin = function (req, res) {
    Customer.findOne({ phone: req.body.phone })
        .exec(function (err, customer) {
            if (err) {
                console.log('Error in customer login.', err)
                res.status(500).json({ error: "Cannot login. Try after some time." })
                return;
            }
            else if (!customer) {
                console.log('Customer Not available')
                res.status(200).json({
                    noCustomer: true
                });
                return;
            }
            else {
                console.log('Customer available :' + customer);
                const authy_Id = customer.authyId;
                authy.request_sms(authy_Id, { force: true }, function (smsErr, smsRes) {
                    if (smsErr) {
                        console.log('ERROR in sending OTP', smsErr);
                        res.status(500).json({ error: "Cannot login. Try after some time." });
                        return;
                    } else {
                        console.log("One-time-password sent :", smsRes);
                        console.log(authy_Id);
                        res.status(200).json({
                            message: "OTP sent on the registered phone.",
                            authy_Id: authy_Id
                        });
                        return;
                    }
                });
            }
        });
};

// Register Customer //
exports.customerRegister = function (req, res) {
    const phone = req.body.phone;
    Customer.findOne({ phone: phone }).exec(function (err, customer) {
        if (err) {
            console.log('Error : User Registration', err);
            res.status(500).json({ error: "Registration failed. Please try again later." });
            return;
        }
        else if (customer) {
            console.log(customer);
            return res.status(500).json({ error: "User already registered. Please login." })
        }
        customer = new Customer({ phone: req.body.phone });

        customer.set('name', req.body.name);
        customer.set('email', req.body.email);
        customer.save(function (err) {
            if (err) {
                console.log('Error in saving customer details in database', err);
                res.status(500).json({ error: "Registration failed. Please try again." });
                return;
            }
            else {
                console.log('Customer added to database successfully', customer);
                var str = customer.phone;
                var rs = str.split("-");
                var code = rs[0];
                var phoneNo = rs[1];
                authy.register_user(customer.email, phoneNo, code, function (regErr, regRes) {
                    if (regErr) {
                        console.log('Error in registering user on Authy -> Deleting Customer document', regErr);
                        Customer.deleteOne({ phone: req.body.phone }).exec(function (deleteErr, deleteRes) {
                            if (deleteErr) {
                                console.log('ERROR in customer document delete', deleteErr);
                                res.status(500).json({ error: "Registration failed. Please try again." });
                                return;
                            }
                            console.log('Customer Deleted from database', deleteRes)
                        });
                        res.status(500).json({ error: "Registration failed. Please try again." });
                        return;
                    }
                    else {
                        console.log(" User added to Authy and AuhtyId generated :", regRes);
                        var authyId = regRes.user.id;
                        customer.set('authyId', authyId);
                        customer.save(function (saveAuthyIdErr) {
                            if (saveAuthyIdErr) {
                                console.log('Error saving authyId in database', saveAuthyIdErr);
                            } else {
                                console.log('AuthyId added to customer database, Sending OTP to :', customer);
                                authy.request_sms(customer.authyId, { force: true }, function (smsErr, smsRes) {
                                    if (smsErr) {
                                        console.log('Error in sending OTP to mobile device', smsErr);
                                    }
                                    console.log("One-time-password sent :", smsRes);
                                    res.status(200).json({
                                        message: "User registered. OTP sent successfully",
                                        customer: {
                                            authy_Id: customer.authyId
                                        },
                                    });
                                    return;
                                });
                            }
                        });
                    }
                });
            }
        });
    });
};

// Verify OTP : Customer//
exports.customerVerify = function (req, res) {
    Customer.findOne({ authyId: req.body.authy_Id }, function (err, customer) {
        if (customer) {
            var Id = customer.authyId;
            var OTP = req.body.otp;
            authy.verify(Id, OTP, function (verifyErr, verifyRes) {
                if (verifyErr) {
                    console.log('Error in OTP Verification', verifyErr);
                    return res.status(500).json({ error: "OTP verification failed. Please try again." });
                } else {
                    console.log("OTP Verified", verifyRes);
                    const jwtToken = JWTtoken(customer._id);
                    console.log(jwtToken);
                    customer.set('token', jwtToken);
                    customer.save(function (err) {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({ error: "Something went wrong. Please try again." });
                        } else {
                            return res.status(200).json({
                                message: "OTP verified. Login successfull",
                                jwtToken
                            });
                        }
                    })
                }
            });
        }
        else {
            console.log('Error in finding customer with Authy ID :', req.body.authy_Id, err);
            res.status(500).json({ error: "Login failed. Please try again." });
            return;
        }
    });
};

//Resend OTP : Customer//
exports.customerResend = function (req, res) {
    Customer.findOne({ authyId: req.body.authy_Id }, function (err, customer) {
        if (customer) {
            authy.request_sms(req.body.authy_Id, { force: true }, function (smsErr, smsRes) {
                if (smsErr) {
                    console.log('Error in sending OTP to mobile device', smsErr);
                    res.status(500).json({
                        error: "Cannot send OTP at the moment."
                    });
                } else {
                    console.log("One-time-password sent :", smsRes);
                    res.status(200).json({
                        message: "OTP sent successfully."
                    });
                    return;
                }
            });
        }
    })
}

//Logout : Customer//
exports.customerLogout = function (req, res) {
    Customer.findOne({ _id: req.userId, token: req.token }, function (err, customer) {
        if (err) {
            return res.status(500).json({ error: "Please try after sometime." })
        }
        customer.updateOne({ $unset: { "token": "" } }, async function (err) {
            if (err) {
                return res.status(500).json({ error: "Please try after sometime." })
            } else {
                req.userId = "";
                req.token = "";
                // console.log(req.token)
                await res.status(200).json({
                    message: "User logged out successfully."
                })
            }
        });
    })
}







// Professional Login
exports.professionalLogin = function (req, res) {
    Professional.findOne({ phone: req.body.phone })
        .exec(function (err, professional) {
            if (err) {
                console.log('Error in professional login.', err)
                res.status(500).json({ error: "Cannot login. Try after some time." })
                return;
            } else if (!professional) {
                console.log('Professional Not available')
                res.status(200).json({
                    message: 'User not found. Please register',
                    noProfessional: true
                });
                return;
            } else {
                console.log('Professional available :' + professional);
                const authy_Id = professional.authyId;
                authy.request_sms(authy_Id, { force: true }, function (smsErr, smsRes) {
                    if (smsErr) {
                        console.log('ERROR in sending OTP', smsErr);
                        res.status(500).json({ error: "Cannot login. Try after some time." });
                        return;
                    }
                    console.log("One-time-password sent :", smsRes);
                });
                return res.status(200).json({
                    message: "OTP sent on the registered phone.",
                    authy_Id: professional.authyId
                });
            }
        });
};

// Register Professional //
exports.professionalRegister = function (req, res) {
    const phone = req.body.phone;
    Professional.findOne({ phone: phone }).exec(function (err, professional) {
        if (err) {
            console.log('Error : User Registration', err);
            res.status(500).json({ error: "Registration failed. Please try again." });
            return;
        }
        professional = new Professional({ phone: req.body.phone });
        professional.set('profession_type', req.body.profession_type);
        professional.set('name', req.body.name);
        professional.set('email', req.body.email);
        professional.save(function (err) {
            if (err) {
                console.log('Error in saving professional details in database', err);
                res.status(500).json({ error: "Registration failed. Please try again." });
                return;
            }
            else {
                console.log('Professional added to database successfully', professional);
                var str = professional.phone;
                var rs = str.split("-");
                var code = rs[0];
                var phoneNo = rs[1];
                authy.register_user(professional.email, phoneNo, code, function (regErr, regRes) {
                    if (regErr) {
                        console.log('Error in registering user on Authy -> Deleting Professional document', regErr);
                        Professional.deleteOne({ phone: req.body.phone }).exec(function (deleteErr, deleteRes) {
                            if (deleteErr) {
                                console.log('ERROR in professional document delete', deleteErr);
                                res.status(500).json({ error: "Registration failed. Please try again." });
                                return;
                            }
                            console.log('Professional Deleted from database', deleteRes)
                        });
                        res.status(500).json({ error: "Registration failed. Please try again." });
                        return;
                    }
                    else {
                        console.log(" User added to Authy and AuhtyId generated :", regRes);
                        var authyId = regRes.user.id;
                        professional.set('authyId', authyId);
                        professional.save(function (saveAuthyIdErr) {
                            if (saveAuthyIdErr) {
                                console.log('Error saving authyId in database', saveAuthyIdErr);
                            } else {
                                console.log('AuthyId added to professional database, Sending OTP to :', professional);
                                authy.request_sms(professional.authyId, { force: true }, function (smsErr, smsRes) {
                                    if (smsErr) {
                                        console.log('Error in sending OTP to mobile device', smsErr);
                                    } else {
                                        console.log("One-time-password sent :", smsRes);
                                        res.status(200).json({
                                            message: "User registered. OTP sent successfully",
                                            professional: {
                                                authy_Id: professional.authyId
                                            },
                                        });
                                        return;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
};

// Verify OTP : Professional//
exports.professionalVerify = function (req, res) {
    Professional.findOne({ authyId: req.body.authy_Id }, function (err, professional) {
        if (professional) {
            var Id = professional.authyId;
            var OTP = req.body.otp;
            authy.verify(Id, OTP, function (tokenErr, tokenRes) {
                if (tokenErr) {
                    console.log('Error in OTP Verification', tokenErr);
                    res.status(500).json({ error: "OTP verification failed. Please try again." });
                    return;
                } else {
                    const jwtToken = JWTtoken(professional._id);
                    professional.set('token', jwtToken);
                    professional.save(function (err) {
                        if (err) {
                            return res.status(500).json({ error: "Something went wrong. Please try again." });
                        }
                        return res.status(200).json({
                            message: "OTP verified. Login successfull",
                            jwtToken,
                            professional
                        });
                    })
                }
            });
        }
        else {
            console.log('Error in finding professional with Authy ID :', req.body.authy_Id, err);
            res.status(500).json({ error: "Login failed. Please try again." });
            return;
        }
    });
};

//Resend OTP : Professional//
exports.professionalResend = function (req, res) {
    Professional.findOne({ authyId: req.body.authy_Id }, function (err, professional) {
        if (professional) {
            authy.request_sms(req.body.authy_Id, { force: true }, function (smsErr, smsRes) {
                if (smsErr) {
                    console.log('Error in sending OTP to mobile device', smsErr);
                    res.status(500).json({
                        error: "Cannot send OTP at the moment."
                    });
                } else {
                    console.log("One-time-password sent :", smsRes);
                    res.status(200).json({
                        message: "OTP sent successfully."
                    });
                    return;
                }
            });
        }
    });
}

//Logout : Customer//
exports.professionalLogout = function (req, res) {
    Professional.findOne({ _id: req.userId, token: req.token }, function (err, professional) {
        if (err) {
            return res.status(500).json({ error: "Please try after sometime." })
        }
        professional.updateOne({ $unset: { "token": "" } }, async function (err) {
            if (err) {
                return res.status(500).json({ error: "Please try after sometime." })
            } else {
                req.userId = "";
                req.token = "";
                // console.log(req.token)
                await res.status(200).json({
                    message: "User logged out successfully."
                })
            }
        });
    })
}