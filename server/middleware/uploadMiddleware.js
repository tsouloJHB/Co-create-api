
const multer = require('multer');
//post middleware
const Storage = multer.diskStorage({
    destination:"uploads",
    filename : (req,file,cb) =>{
        cb(null,Date.now()+file.originalname);
        // cb(null,file.originalname);
    },
});

const upload = multer({
    storage:Storage
}).single('imageUpload')


module.exports = {upload}