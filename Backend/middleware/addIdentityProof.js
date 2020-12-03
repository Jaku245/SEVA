var multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/professional/applicationForm/identityProof');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${file.fieldname}-${req.userId}-${Date.now()}.${ext}`);
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb("Not an image", false)
    }
}

const uploadIdentity = multer({
    storage: multerStorage,
    fileFilter: multerFilter
}).fields([
    { name: "aadharfront", maxCount: 1 },
    { name: "aadharback", maxCount: 1 },
    { name: "pancard", maxCount: 1 },
    { name: "addressProof", maxCount: 1 }
])


exports.multerIdentityProof = (req, res, next) => {
    uploadIdentity(req, res, function (err) {
        if (!req.files.aadharfront[0]) {
            return res.status(500).json({
                error: 'Please upload the front side of your aadhar card.'
            });
        } else if (!req.files.aadharback[0]) {
            return res.status(500).json({
                error: 'Please upload the back side of your aadhar card.'
            });
        } else if (!req.files.addressProof[0]) {
            return res.status(500).json({
                error: 'Please upload identity proof.'
            });
        } else if (!req.files.pancard[0]) {
            return res.status(500).json({
                error: 'Please upload your pancard.'
            });
        } else if (err instanceof multer.MulterError) {
            console.log(err)
            return res.status(500).json({
                error: 'Something went wrong. Please try after sometime.'
            });
        } else if (err) {
            console.log(err)
            return res.status(500).json({
                error: 'Something went wrong. Please try after sometime.'
            });
        } else {
            // Display uploaded image for user validation
            const aadharfrontpath = req.files.aadharfront[0].path;
            const aadharbackpath = req.files.aadharback[0].path;
            const pancardpath = req.files.pancard[0].path;
            const addressproofpath = req.files.addressProof[0].path;
            req.aadharfront = aadharfrontpath;
            req.aadharback = aadharbackpath;
            req.pancard = pancardpath;
            req.addressproof = addressproofpath;
            console.log(aadharfrontpath, aadharbackpath, pancardpath, addressproofpath, "Image uploded to public successfully")
            // return res.json({
            //     message: "done"
            // })
            next(); // send uploaded image
        }
    });
}