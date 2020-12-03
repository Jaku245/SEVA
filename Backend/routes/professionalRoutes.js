const express = require('express')
const router = express.Router();

const professionalToken = require('../middleware/check-professional-auth');
const generateInvoiceDetails = require('../middleware/generateInvoiceDetails');
const { professionalProfileImage } = require('../middleware/professionalProfileImage');
const { multerCancelledCheque } = require('../middleware/addCancelledCheque');
const { multerIdentityProof } = require('../middleware/addIdentityProof');
const { multerAttachments } = require('../middleware/addAttachments');

const {
    professionalLogin,
    professionalRegister,
    professionalVerify,
    professionalResend,
    professionalLogout
} = require('../controller/authController');

const {
    professionalDetails,
    updateProfessional,
    uploadProfileImage,
    submitApplication,
    resubmitApplication,
    submitAttachPhotos,
    submitBankDetails,
    submitIdentityVerification,
    submitPersonalDetails,
    fetchServiceRequests,
    takeServiceAction,
    getBookingHistory,
    acceptedServices,
    sendAddOnsList,
    updateService
} = require('../controller/professionalController');

const {
    generatePaymentLink,
    resendNotification,
    fetchPaymentStatus,
    cancelOnlinePayment,
    initiateCash,
    cancelCash,
    confirmCash
} = require('../controller/paymentController');


// AUTH - ROUTES //
router.route('/professional/register').post(professionalRegister);
router.route('/professional/login').post(professionalLogin);
router.route('/professional/verify_otp').post(professionalVerify);
router.route('/professional/resend_otp').post(professionalResend);
router.route('/professional/logout').post(professionalToken, professionalLogout);


// DASHBOARD - ROUTES //
router.route('/professional/userDetails')
    .get(professionalToken, professionalDetails);


// APPLICATION TAB - ROUTES //
router.route('/professional/submit/identityVerification/:professionalId')
    .post(professionalToken, multerIdentityProof, submitIdentityVerification);
router.route('/professional/submit/personalDetails/:professionalId')
    .post(professionalToken, submitPersonalDetails);
router.route('/professional/submit/bankDetails/:professionalId')
    .post(professionalToken, multerCancelledCheque, submitBankDetails);
router.route('/professional/submit/attachPhotos/:professionalId')
    .post(professionalToken, multerAttachments, submitAttachPhotos);
router.route('/professional/submitApplication/:professionalId')
    .post(professionalToken, submitApplication);
router.route('/professional/resubmitApplication/:professionalId')
    .post(professionalToken, resubmitApplication);


// UPCOMING REQUESTS TAB - ROUTES //
router.route('/professional/serviceRequest/fetch/:professionalId')
    .get(professionalToken, fetchServiceRequests)
router.route('/professional/serviceRequest/action/:professionalId')
    .put(professionalToken, takeServiceAction)


// WORK PROFILE MENU OPTION - ROUTES //
router.route('/professional/update/:professionalId')
    .put(professionalToken, updateProfessional);
router.route('/professional/uploadProfileImage/:professionalId')
    .put(professionalToken, professionalProfileImage, uploadProfileImage);


// HISTORY TAB - ROUTES //
router.route('/professional/serviceRequest/history/:professionalId')
    .get(professionalToken, getBookingHistory)


// DASHBOARD TAB - ROUTES //
router.route('/professional/serviceRequest/accepted/:professionalId')
    .get(professionalToken, acceptedServices)
router.route('/professional/serviceRequest/sendaddons/:professionalId')
    .get(professionalToken, sendAddOnsList)
router.route('/professional/serviceRequest/update/:professionalId/:bookingId')
    .put(professionalToken, updateService)



// PAYMENT ROUTES //
// ONLINE PAYMENT ROUTES //
router.route('/professional/serviceRequest/generate_payment_link/:bookingId')
    .put(professionalToken, generateInvoiceDetails, generatePaymentLink);
router.route('/professional/serviceRequest/resendlink/:bookingId')
    .put(professionalToken, resendNotification);
router.route('/professional/serviceRequest/fetchpaymentstatus/:bookingId')
    .put(professionalToken, fetchPaymentStatus);
router.route('/professional/serviceRequest/cancelonlinepayment/:bookingId')
    .put(professionalToken, cancelOnlinePayment);

    
// OFFLINE PAYMENT ROUTES //
router.route('/professional/serviceRequest/initiatecash/:bookingId')
    .put(professionalToken, initiateCash);
router.route('/professional/serviceRequest/confirmcash/:bookingId')
    .put(professionalToken, confirmCash);
router.route('/professional/serviceRequest/cancelcash/:bookingId')
    .put(professionalToken, cancelCash);


module.exports = router;