var multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/professional/applicationForm/attachments');
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
    { name: "att_1", maxCount: 1 },
    { name: "att_2", maxCount: 1 },
    { name: "att_3", maxCount: 1 },
    { name: "att_4", maxCount: 1 },
    { name: "att_5", maxCount: 1 },
    { name: "att_6", maxCount: 1 }
])


exports.multerAttachments = (req, res, next) => {
    uploadIdentity(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err)
            return res.status(500).json({
                error: 'Something went wrong. Please try after sometime.'
            });
        } else if (err) {
            console.log(err)
            return res.status(500).json({
                error: 'Something went wrong. Please try after sometime.'
            });
        } else {// Display uploaded image for user validation
            let att_1_path = '';
            let att_2_path = '';
            let att_3_path = '';
            let att_4_path = '';
            let att_5_path = '';
            let att_6_path = '';
            if (req.files.att_1)
                att_1_path = req.files.att_1[0].path;
            if (req.files.att_2)
                att_2_path = req.files.att_2[0].path;
            if (req.files.att_3)
                att_3_path = req.files.att_3[0].path;
            if (req.files.att_4)
                att_4_path = req.files.att_4[0].path;
            if (req.files.att_5)
                att_5_path = req.files.att_5[0].path;
            if (req.files.att_6)
                att_6_path = req.files.att_6[0].path;
            req.att_1 = att_1_path;
            req.att_2 = att_2_path;
            req.att_3 = att_3_path;
            req.att_4 = att_4_path;
            req.att_5 = att_5_path;
            req.att_6 = att_6_path;
            next(); // send uploaded image
        }
    });
}