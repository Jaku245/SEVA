const express = require('express')
const router = express.Router();

const adminToken = require('../middleware/check-admin-auth');

const {
    adminLogin,
    adminRegister,
    adminVerify,
    adminResend,
    adminLogout
} = require('../controller/authController');

const {
    adminDetails,
    fetchApplications,
    takeActionApplications,
    fetchCustomers,
    flagCustomer,
    viewCustomer,
    fetchProfessionals,
    flagProfessional,
    viewProfessional,
    fetchBookings
} = require('../controller/adminController');


// AUTH - ROUTES //
router.route('/login').post(adminLogin);
router.route('/register').post(adminRegister);
router.route('/verify_otp').post(adminVerify);
router.route('/resend_otp').post(adminResend);
router.route('/logout').post(adminToken, adminLogout);

// DASHBOARD - ROUTES //
router.route('/userDetails')
    .get(adminToken, adminDetails);

// NEW APPLICATION - ROUTES //
router.route('/fetch/applications/:adminId')
    .get(adminToken, fetchApplications);
router.route('/take_action/applications/:applicationId/:adminId')
    .put(adminToken, takeActionApplications);

// MANAGE CUSTOMERS - ROUTES //
router.route('/list/customers')
    .get(adminToken, fetchCustomers);
router.route('/flag/customer/:customerId/:adminId')
    .put(adminToken, flagCustomer);
router.route('/view/customer/:customerId')
    .get(adminToken, viewCustomer);

// MANAGE PROFESSIONALS - ROUTES //
router.route('/list/professionals')
    .get(adminToken, fetchProfessionals);
router.route('/flag/professional/:professionalId/:adminId')
    .put(adminToken, flagProfessional);
router.route('/view/professional/:professionalId')
    .get(adminToken, viewProfessional);

// VIEW REPORTS & BOOKINGS - ROUTE //
router.route('/all/bookings')
    .get(adminToken, fetchBookings);

module.exports = router  