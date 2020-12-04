require('../models/Customers');
require('../models/Category');
require('../models/SubCategory');

var mongoose = require('mongoose');

const Customer = mongoose.model('Customer');
const Category = mongoose.model('Category');
const SubCategory = mongoose.model('SubCategory');


// CUSTOMER DASHBOARD CONTROLLERS //
exports.customerDashboard = function (req, res) {
    const id = req.userId;
    Customer.findById({ _id: id }, function (err, customer) {
        if (err) {
            return res.status(500).json({
                error: "Error Occured. Please try after sometime."
            });
        } else {
            // console.log(customer);
            var str = customer.phone;
            var rs = str.split("-");
            var phoneNo = rs[1];
            const customerId = customer._id;
            const customerPhone = phoneNo;
            const customerName = customer.name;
            const customerEmail = customer.email;
            const customerProfile = customer.profile_image;
            Category.find(function (err, category) {
                if (category) {
                    return res.status(200).json({
                        customer: {
                            customerId,
                            customerName,
                            customerPhone,
                            customerEmail,
                            customerProfile
                        },
                        category: category
                    })
                } else {
                    return res.status(500).json({
                        error: "Something went wrong. Please try after sometime."
                    });
                }
            });
        }
    })
}

exports.selectSubCategory = function (req, res) {
    const c_id = req.params.categoryId;
    Category.findById({ _id: c_id }, function (err, category) {
        if (category) {
            console.log("Category available");
            SubCategory.find({ categoryId: category._id }, function (err, subCategory) {
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
            return res.status(500).json({
                error: "Something went wrong. Please try again."
            })
        }
    })
}


// UPDATE CONTROLLERS //
exports.updateCustomer = function (req, res) {
    Customer.findByIdAndUpdate(
        { _id: req.params.customerId },
        {
            "$set": {
                "name": req.body.name,
                "email": req.body.email,
            }
        })
        .then(function (customer, err) {
            if (customer) {
                return res.status(200).json({
                    message: "User details updated successfully."
                })
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Connot update user details. Please try again later"
                })
            }
        })
}

exports.uploadProfileImage = function (req, res) {
    Customer.findByIdAndUpdate(
        { _id: req.params.customerId },
        {
            $set: {
                'profile_image': req.profileImage
            }
        })
        .then(function (customer, err) {
            if (customer) {
                const profile_image = req.profileImage;
                return res.status(200).json({
                    message: "Profile image updated successfully.",
                    profile_image
                })
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Connot update user details. Please try again later"
                })

            }
        })
}


// ADDRESS CONTROLLERS //
exports.viewAddressBook = function (req, res) {
    const id = req.userId;
    Customer.findById({ _id: id }, function (err, customer) {
        if (customer) {
            const addressBook = customer.address_book;
            console.log(addressBook);
            return res.status(200).json({
                AddressBook: addressBook
            })
        } else {
            return res.status(500).json({
                error: "Something went wrong. Please try again."
            })
        }
    })
}

exports.addAddress = function (req, res) {
    const id = req.userId;
    Customer.findById({ _id: id }, function (err, customer) {
        if (customer) {
            const coordinates = {
                lat : req.body.latitude,
                lng : req.body.longitude
            }
            const address = {
                "coordinates" : coordinates,
                "person_name": req.body.name,
                "address_detail1": req.body.detail1,
                "address_detail2": req.body.detail2,
                "city": req.body.city,
                "state": req.body.state,
                "address_type": req.body.type,
            };
            console.log(customer.address_book);
            console.log(address);
            Customer.findByIdAndUpdate(
                { _id: id },
                { $push: { address_book: address } },
                function (err) {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({
                            error: "Cannot add address into your address book. Please try again."
                        })
                    } else {
                        return res.status(200).json({
                            message: "New address added successfully."
                        });
                    }
                })
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Something went wrong. Please try again."
            })
        }
    })
}

exports.viewAddress = function (req, res) {
    const id = req.userId;
    Customer.findById({ _id: id }, function (err, customer) {
        if (customer) {
            const address_id = req.params.addressId;
            Customer
                .find({ "_id": id, "address_book._id": address_id },
                    { "address_book.$": 1 })
                .then(function (err, address) {
                    if (err) {
                        return res.status(500).json({
                            error: "Something went wrong. Please try again."
                        });
                    } else {
                        const Address = address[0].address_book[0];
                        console.log(Address);
                        return res.status(200).json({
                            Address
                        });
                    }
                });
        } else {
            return res.status(500).json({
                error: "Something went wrong. Please try again."
            });
        }
    })
}

exports.updateAddress = function (req, res) {
    const id = req.userId;
    Customer.findById({ _id: id }, function (err, customer) {
        if (customer) {
            const address_id = req.params.addressId;
            const coordinates = {
                lat : req.body.latitude,
                lng : req.body.longitude
            }
            Customer.updateOne(
                { "address_book._id": address_id },
                {
                    "$set": {
                        "address_book.$.coordinates" : coordinates,
                        "address_book.$.person_name": req.body.name,
                        "address_book.$.address_detail1": req.body.detail1,
                        "address_book.$.address_detail2": req.body.detail2,
                        "address_book.$.city": req.body.city,
                        "address_book.$.state": req.body.state,
                        "address_book.$.address_type": req.body.type,
                    }
                }
            ).then(function (customer) {
                if (customer) {
                    return res.status(200).json({
                        message: "Updated successfully."
                    })
                } else {
                    return res.status(500).json({
                        error: "Something went wrong. Please try again."
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

exports.deleteAddress = function (req, res) {
    const id = req.userId;
    Customer.findById({ _id: id }, function (err, customer) {
        if (customer) {
            const address_id = req.params.addressId;
            Customer.findOneAndUpdate(
                { "_id": id },
                { $pull: { address_book: { _id: address_id } } },
                { 'new': true },
                function (err) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: 'Error in deleting address. Please try again.' });
                    } else {
                        return res.status(200).json({
                            message: "Address deleted sucessfully."
                        });
                    }
                });
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Something went wrong. Please try again."
            });
        }
    })
}
