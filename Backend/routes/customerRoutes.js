const express = require('express')
const router = express.Router();

const customerToken = require('../middleware/check-customer-auth');
const { customerProfileImage } = require('../middleware/customerProfileImage');

const {
    customerLogin,
    customerRegister,
    customerVerify,
    customerResend,
    customerLogout
} = require('../controller/authController');

const {
    customerDashboard,
    selectSubCategory,
    viewAddressBook,
    addAddress,
    viewAddress,
    updateAddress,
    deleteAddress,
    updateCustomer,
    uploadProfileImage
} = require('../controller/customerController')

const {
    requestService,
    viewProfessional,
    viewBookingDetails,
    rescheduleServiceRequest,
    cancelServiceRequest,
    viewBookings,
    giveFeedback
} = require('../controller/serviceRequestController')



// AUTH - ROUTES //
router.route('/customer/login').post(customerLogin);
router.route('/customer/register').post(customerRegister);
router.route('/customer/verify_otp').post(customerVerify);
router.route('/customer/resend_otp').post(customerResend);
router.route('/customer/logout').post(customerToken, customerLogout);


// DASHBOARD - ROUTES //
// HOME TAB - ROUTES //
router.route('/customer/dashboard').get(customerToken, customerDashboard);
router.route('/customer/dashboard/:categoryId').get(customerToken, selectSubCategory);

//service search



// PROFILE TAB - ROUTES //
router.route('/customer/update/:customerId').patch(customerToken, updateCustomer);
router.route('/customer/uploadProfileImage/:customerId').patch(customerToken, customerProfileImage, uploadProfileImage);



// CUSTOMER ADDRESS ROUTES //
router.route('/customer/viewaddressbook').get(customerToken, viewAddressBook);
router.route('/customer/addaddress').put(customerToken, addAddress);
router.route('/customer/viewaddress/:addressId')
    .get(customerToken, viewAddress)
    .patch(customerToken, updateAddress)
    .delete(customerToken, deleteAddress);



// CUSTOMER - REQUEST SERVICE ROUTES //
router.route('/customer/viewBookings/:customerId').get(customerToken, viewBookings);
router.route('/customer/requestservice/:customerId').post(customerToken, requestService);
router.route('/customer/cancelServiceRequest/:customerId/:bookingId').patch(customerToken, cancelServiceRequest);
router.route('/customer/requestservice/:customerId/:bookingId/:professionalId').get(customerToken, viewProfessional);
router.route('/customer/booking/:customerId/:bookingId')
    .get(customerToken, viewBookingDetails)
    .patch(customerToken, rescheduleServiceRequest);
router.route('/customer/feedback/:customerId/:bookingId/:professionalId').post(customerToken, giveFeedback);



module.exports = router;