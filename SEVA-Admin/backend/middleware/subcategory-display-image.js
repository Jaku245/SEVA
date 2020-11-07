var multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/subCategoryImage');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `subcategory-${req.userId}-${Date.now()}.${ext}`);
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb("You can only upload an image file.", false)
    }
}

const uploadImage = multer({
    storage: multerStorage,
    fileFilter: multerFilter
}).single('display_image')


exports.subCategoryDisplayImage = (req, res, next) => {
    uploadImage(req, res, function (err) {
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
        } else {
            // Display uploaded image for user validation
            const displayImagePath = req.file.path;
            req.display_image = displayImagePath;
            console.log(displayImagePath, "Image uploded to public successfully")
            next(); // send uploaded image
        }
    });
}