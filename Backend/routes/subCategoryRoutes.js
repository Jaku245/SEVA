const express = require('express')
const router = express.Router();

var subCategory = require('../controller/subCategoryController');

router.route('/admin/subCategory/create').post(subCategory.create);

//subcategory update
//subcategory delete

module.exports = router  