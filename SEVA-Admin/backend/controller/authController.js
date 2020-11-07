require('../models/Admins');

var mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const jwt = require("jsonwebtoken");
var config = require('../config');
var authy = require('authy')(config.API_KEY);

const JWTtoken = (id) => jwt.sign({ id: id }, config.JWT_KEY);


// Admin : Login
exports.adminLogin = function (req, res) {
    Admin.findOne({ adminId: req.body.adminId })
        .exec(function (err, admin) {
            if (err) {
                console.log('Error in admin login.', err)
                res.status(500).json({ error: "Cannot login. Try after some time." })
                return;
            }
            else if (!admin) {
                console.log('Admin Not Available')
                res.status(200).json({
                    message: 'User not found. Please Register.',
                    admin: null
                });
                return;
            }
            else {
                console.log('Admin available :' + admin);
                const authy_Id = admin.authyId;
                authy.request_sms(authy_Id, { force: true }, function (smsErr, smsRes) {
                    if (smsErr) {
                        console.log('Error in sending OTP', smsErr);
                        res.status(500).json({ error: "Cannot login. Please try after some time." });
                        return;
                    }
                    console.log("One-time-password sent on registered phone:", smsRes);
                });
                res.status(200).json({
                    message: "OTP sent on the registered phone.",
                    admin: {
                        authy_Id: admin.authyId
                    },
                });
                return;
            }
        });
};

// Register : Admin //
exports.adminRegister = function (req, res) {
    const adminId = req.body.adminId;
    Admin.findOne({ adminId: adminId }).exec(function (err, admin) {
        if (err) {
            console.log('Error : User Registration', err);
            res.status(500).json({ error: "Registration failed. Please try again." });
            return;
        } else if (!admin) {
            admin = new Admin({ adminId: req.body.adminId });
            admin.set('phone', req.body.phone);
            admin.set('name', req.body.name);
            admin.set('email', req.body.email);
            admin.save(function (err) {
                if (err) {
                    console.log('Error in saving admin details in database', err);
                    res.status(500).json({ error: "Registration failed. Please try again." });
                    return;
                }
                else {
                    console.log('Admin added to database successfully', admin);
                    var str = admin.phone;
                    var rs = str.split("-");
                    var code = rs[0];
                    var phoneNo = rs[1];
                    authy.register_user(admin.email, phoneNo, code, function (regErr, regRes) {
                        if (regErr) {
                            console.log('Error in registering user on Authy -> Deleting admin document', regErr);
                            Admin.deleteOne({ adminId: req.body.adminId }).exec(function (deleteErr, deleteRes) {
                                if (deleteErr) {
                                    console.log('ERROR in admin document delete', deleteErr);
                                    res.status(500).json({ error: "Registration failed. Please try again." });
                                    return;
                                }
                                console.log('Admin Deleted from database', deleteRes)
                            });
                            res.status(500).json({ error: "Registration failed. Please try again." });
                            return;
                        }
                        else {
                            console.log(" User added to Authy and AuhtyId generated :", regRes);
                            var authyId = regRes.user.id;
                            admin.set('authyId', authyId);
                            admin.save(function (saveAuthyIdErr) {
                                if (saveAuthyIdErr) {
                                    console.log('Error saving authyId in database', saveAuthyIdErr);
                                } else {
                                    console.log('AuthyId added to admin database, Sending OTP to :', admin);
                                    authy.request_sms(admin.authyId, { force: true }, function (smsErr, smsRes) {
                                        if (smsErr) {
                                            console.log('Error in sending OTP to mobile device', smsErr);
                                        } else {
                                            console.log("One-time-password sent :", smsRes);
                                            res.status(200).json({
                                                message: "User registered. OTP sent successfully",
                                                admin: {
                                                    authy_Id: admin.authyId
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
        } else {
            console.log(admin)
            res.status(200).json({ message: "Registeration failed. User already exists." });
            return;
        }
    });
};

// Verify OTP : Admin//
exports.adminVerify = function (req, res) {
    Admin.findOne({ authyId: req.body.authy_Id }, function (err, admin) {
        if (admin) {
            var Id = admin.authyId;
            var OTP = req.body.otp;
            authy.verify(Id, OTP, function (tokenErr, tokenRes) {
                if (tokenErr) {
                    console.log('Error in OTP Verification', tokenErr);
                    res.status(500).json({ error: "OTP verification failed. Please try again." });
                    return;
                } else {
                    const jwtToken = JWTtoken(admin._id);
                    admin.set('token', jwtToken);
                    admin.save(function (err) {
                        if (err) {
                            return res.status(500).json({ error: "Something went wrong. Please try again." });
                        }
                        return res.status(200).json({
                            message: "OTP verified. Login successfull",
                            jwtToken,
                            admin
                        });
                    })
                }
            });
        }
        else {
            console.log('Error in finding admin with Authy ID :', req.body.authy_Id, err);
            res.status(500).json({ error: "Login failed. Please try again." });
            return;
        }
    });
};

//Resend OTP : Admin//
exports.adminResend = function (req, res) {
    Admin.findOne({ authyId: req.body.authy_Id }, function (err, admin) {
        if (admin) {
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

//Logout : Admin//
exports.adminLogout = function (req, res) {
    Admin.findOne({ _id: req.userId, token: req.token }, function (err, admin) {
        if (err) {
            return res.status(500).json({ error: "Please try after sometime." })
        }
        admin.updateOne({ $unset: { "token": "" } }, async function (err) {
            if (err) {
                return res.status(500).json({ error: "Please try after sometime." })
            } else {
                req.userId = "";
                req.token = "";
                await res.status(200).json({
                    message: "User logged out successfully."
                })
            }
        });
    })
}