var multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/customer/profilePhoto');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `customer-${req.userId}-${Date.now()}.${ext}`);
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb("Not an image", false)
    }
}

const uploadProfile = multer({
    storage: multerStorage,
    fileFilter: multerFilter
}).single('profile_image');





exports.customerProfileImage = (req, res, next) => {
    uploadProfile(req, res, function (err) {
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
            const profileImagePath = req.file.path;
            req.profileImage = profileImagePath;
            console.log(profileImagePath, "Image uploded to public successfully")
            next(); // send uploaded image
        }
    });
}
