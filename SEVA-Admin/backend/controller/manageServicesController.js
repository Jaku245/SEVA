require('../models/Admins');
require('../models/Category');
require('../models/SubCategory');

var mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const Category = mongoose.model('Category');
const SubCategory = mongoose.model('SubCategory');


// CATEGORY - CONTROLLER //
exports.listCategories = function (req, res) {
    Category.find(function (err, category) {
        if (category) {
            console.log(category)
            return res.status(200).json({
                category
            })
        } else if (!category) {
            console.log(category)
            return res.status(200).json({
                message: "No category available. Begin by adding a category."
            })
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Something went wrong. Please try after sometime."
            });
        }
    });
}
exports.addCategory = function (req, res) {
    console.log(
        req.body.name,
        req.body.profession_type,
        req.body.about,
        req.display_image
    )
    category = new Category({ 'name': req.body.name });
    category.set({ 'profession_type': req.body.profession_type })
    category.set({ 'about': req.body.about })
    category.set({ 'display_image': req.display_image })
    category.save(function (err) {
        if (err) {
            console.log(err)
            return res.status(500).json({
                error: 'Error in adding category to the inventory'
            })
        }
        else {
            console.log(category)
            res.status(200).json({
                message: 'Category added successfully in the inventory'
            })
        }
    })
}
exports.modifyCategory = function (req, res) {
    const c_id = req.params.categoryId;
    Category.findByIdAndUpdate(
        { _id: c_id },
        {
            "$set": {
                "name": req.body.name,
                "profession": req.body.categoryName,
                "about": req.body.about,
            }
        },
        function (err, category) {
            if (category) {
                return res.status(200).json({
                    message: "Category updated successfully."
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
exports.modifyCategoryWithImage = function (req, res) {
    const c_id = req.params.categoryId;
    Category.findByIdAndUpdate(
        { _id: c_id },
        {
            "$set": {
                "name": req.body.name,
                "profession": req.body.profession,
                "about": req.body.about,
                "display_image": req.display_image
            }
        },
        function (err, category) {
            if (category) {
                return res.status(200).json({
                    message: "Category updated successfully."
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
exports.deleteCategory = function (req, res) {
    const c_id = req.params.categoryId;
    Category.findByIdAndDelete({ _id: c_id }, function (err, data) {
        if (err) {
            return res.status(500).json({
                error: 'Error in deleting category from the inventory.'
            })
        } else if (data != null) {
            console.log(data)
            return res.status(200).json({
                message: 'Category deleted successfully from the inventory'
            })
        } else {
            console.log(data)
            return res.status(200).json({
                mess: 'Something went wrong, please try again.'
            })
        }
    })
}

// SUB CATEGORY - CONTROLLER //
exports.listSubCategories = function (req, res) {
    const c_id = req.params.categoryId;
    Category.findById({ _id: c_id }, function (err, category) {
        if (category) {
            console.log("Category available");
            console.log(category);
            SubCategory.find({ categoryId: category._id }, function (err, subCategory) {
                if (subCategory) {
                    console.log("Sub Category available");
                    console.log(subCategory);
                    return res.status(200).json({
                        subCategory
                    })
                } else if (!subCategory) {
                    console.log(subCategory)
                    return res.status(200).json({
                        message: "No sub-category available. Begin by adding a sub-category."
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
                error: "Something went wrong. Please try again."
            })
        }
    })
}
exports.addSubCategory = function (req, res) {
    const c_id = req.params.categoryId;
    Category.findById({ _id: c_id }, function (err, category) {
        if (category) {
            const newSubCategory = {
                "name": req.body.name,
                "categoryId": category._id,
                "categoryName": category.name,
                "profession": category.profession_type,
                "about": req.body.about,
                "display_image": req.display_image
            }
            subCategory = new SubCategory(newSubCategory);
            subCategory.save(function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        error: 'Error in adding sub-category to the inventory'
                    })
                }
                else {
                    console.log(subCategory)
                    res.status(200).json({
                        message: 'Sub-Category added successfully in the inventory'
                    })
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
exports.modifySubCategory = function (req, res) {
    const sc_id = req.params.subcategoryId;
    SubCategory.findByIdAndUpdate(
        { _id: sc_id },
        {
            "$set": {
                "name": req.body.name,
                "about": req.body.about,
            }
        },
        function (err, subCategory) {
            if (subCategory) {
                console.log(subCategory)
                return res.status(200).json({
                    message: "Sub Category updated successfully."
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
exports.modifySubCategoryWithImage = function (req, res) {
    const sc_id = req.params.subcategoryId;
    SubCategory.findByIdAndUpdate(
        { _id: sc_id },
        {
            "$set": {
                "name": req.body.name,
                "about": req.body.about,
                "display_image": req.display_image
            }
        },
        function (err, subCategory) {
            if (subCategory) {
                return res.status(200).json({
                    message: "Sub Category updated successfully."
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
exports.deleteSubCategory = function (req, res) {
    const sc_id = req.params.subcategoryId;
    SubCategory.findByIdAndDelete({ _id: sc_id }, function (err, data) {
        if (err) {
            console.log(err)
            return res.status(500).json({
                error: 'Error in deleting sub-category from the inventory.'
            })
        } else if (data != null) {
            console.log(data)
            return res.status(200).json({
                message: 'Sub-Category deleted successfully from the inventory'
            })
        } else {
            console.log(data)
            return res.status(200).json({
                mess: 'Something went wrong, please try again.'
            })
        }
    })
}

// SERVICE - CONTROLLER //
exports.listServices = function (req, res) {
    const sc_id = req.params.subcategoryId;
    SubCategory.findById({ _id: sc_id }, function (err, subCategory) {
        if (subCategory) {
            console.log("SubCategory available");
            console.log(subCategory);
            if (subCategory.services) {
                console.log("Services available");
                console.log(subCategory.services);
                const services = subCategory.services
                return res.status(200).json({
                    services
                })
            } else if (subCategory.services == null) {
                console.log(subCategory.services)
                return res.status(200).json({
                    message: "No services available. Begin by adding a service."
                })
            }
        } else {
            console.log(err)
            return res.status(500).json({
                error: "Something went wrong. Please try again."
            })
        }
    })
}
exports.addService = function (req, res) {
    const sc_id = req.params.subcategoryId;
    const service = {
        "name": req.body.name,
        "about": req.body.about,
        "price": req.body.price,
        "duration": req.body.duration,
        "description": req.body.description,
        "display_image": req.display_image,
    };
    SubCategory.findByIdAndUpdate(
        { _id: sc_id },
        { $push: { services: service } },
        function (err, subCategory) {
            if (subCategory) {
                console.log(subCategory)
                return res.status(200).json({
                    message: "Service added successfully in the inventory."
                });
            } else {
                console.log(err)
                return res.status(500).json({
                    error: "Something went wrong. Please try again."
                })
            }
        })
}
exports.modifyService = function (req, res) {
    const sc_id = req.params.subcategoryId;
    const s_id = req.params.serviceId;
    SubCategory.findOneAndUpdate(
        {
            _id: sc_id,
            'services._id': s_id
        },
        {
            "$set": {
                "services.$.name": req.body.name,
                "services.$.about": req.body.about,
                "services.$.price": req.body.price,
                "services.$.duration": req.body.duration,
                "services.$.description": req.body.description,
            }
        },
        function (err, subCategory) {
            if (subCategory) {
                console.log(subCategory.services)
                return res.status(200).json({
                    message: "Service updated successfully."
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
exports.modifyServicewithImage = function (req, res) {
    const sc_id = req.params.subcategoryId;
    const s_id = req.params.serviceId;
    SubCategory.findOneAndUpdate(
        {
            _id: sc_id,
            'services._id': s_id
        },
        {
            "$set": {
                "services.$.name": req.body.name,
                "services.$.about": req.body.about,
                "services.$.price": req.body.price,
                "services.$.duration": req.body.duration,
                "services.$.description": req.body.description,
                "services.$.display_image": req.display_image,
            }
        },
        function (err, subCategory) {
            if (subCategory) {
                console.log(subCategory.services)
                return res.status(200).json({
                    message: "Service updated successfully."
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
exports.deleteService = function (req, res) {
    const sc_id = req.params.subcategoryId;
    const s_id = req.params.serviceId;
    SubCategory.findByIdAndUpdate(
        { _id: sc_id },
        { $pull: { services: { _id: s_id } } },
        { 'new': true },
        function (err, data) {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    error: 'Error in deleting sub-category from the inventory.'
                })
            } else if (data != null) {
                console.log(data)
                return res.status(200).json({
                    message: 'Service deleted successfully from the inventory'
                })
            } else {
                console.log(data)
                return res.status(200).json({
                    mess: 'Something went wrong, please try again.'
                })
            }
        })
}
