const express = require('express')
const router = express.Router();

const adminToken = require('../middleware/check-admin-auth');
const { categoryDisplayImage } = require('../middleware/category-display-image');
const { subCategoryDisplayImage } = require('../middleware/subcategory-display-image');
const { serviceDisplayImage } = require('../middleware/service-display-image');

const {

    listCategories,
    addCategory,
    modifyCategory,
    modifyCategoryWithImage,
    deleteCategory,

    listSubCategories,
    addSubCategory,
    modifySubCategory,
    modifySubCategoryWithImage,
    deleteSubCategory,

    listServices,
    addService,
    modifyService,
    modifyServicewithImage,
    deleteService,

} = require('../controller/manageServicesController');

// CATEGORY - ROUTES //
router.route('/category').get(adminToken, listCategories);
router.route('/category/create').post(adminToken, categoryDisplayImage, addCategory);
router.route('/category/modify/:categoryId').put(adminToken, modifyCategory);
router.route('/category/modifyImage/:categoryId').put(adminToken, categoryDisplayImage, modifyCategoryWithImage);
router.route('/category/delete/:categoryId').delete(adminToken, deleteCategory);

// SUBCATEGORY - ROUTES //
router.route('/subcategory/:categoryId').get(adminToken, listSubCategories);
router.route('/subcategory/create/:categoryId').post(adminToken, subCategoryDisplayImage, addSubCategory);
router.route('/subcategory/modify/:subcategoryId').put(adminToken, modifySubCategory);
router.route('/subcategory/modifyImage/:subcategoryId').put(adminToken, subCategoryDisplayImage, modifySubCategoryWithImage);
router.route('/subcategory/delete/:subcategoryId').delete(adminToken, deleteSubCategory);

// SERVICE - ROUTES //
router.route('/service/:subcategoryId').get(adminToken, listServices);
router.route('/service/create/:subcategoryId').post(adminToken, serviceDisplayImage, addService);
router.route('/service/modify/:subcategoryId/:serviceId').put(adminToken, modifyService);
router.route('/service/modifyImage/:subcategoryId/:serviceId').put(adminToken, serviceDisplayImage, modifyServicewithImage);
router.route('/service/delete/:subcategoryId/:serviceId').delete(adminToken, deleteService);

module.exports = router