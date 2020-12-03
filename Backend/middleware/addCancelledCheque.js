var multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/professional/applicationForm/bankDetails');
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

const uploadCheque = multer({
    storage: multerStorage,
    fileFilter: multerFilter
}).single('cancelled_cheque');


exports.multerCancelledCheque = (req, res, next) => {
    uploadCheque(req, res, function (err) {
        if (!req.file) {
            return res.status(500).json({
                error: 'Please select an image to upload'
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
            const cancelledChequePath = req.file.path;
            req.cancelledCheque = cancelledChequePath;
            console.log(cancelledChequePath, "Image uploded to public successfully")
            next(); // send uploaded image
        }
    });
}