const express = require('express')
const router = express.Router();

var category = require('../controller/categoryController');

router.route('/admin/category/create').post(category.create);

//category update
//category delete

module.exports = router  