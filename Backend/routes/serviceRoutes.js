const express = require('express')
const router = express.Router();

var service = require('../controller/serviceController');

router.route('/admin/service/create').post(service.create);

//service update
//service delete

module.exports = router  