const express = require('express');
const router = express.Router();

// multer
// 이미지,동영상 등을 비롯해 여러 가지 파일을 멀티파트 형식으로 업로드할때 사용하는 미들웨어 입니다.
// 멀티파트 형식이란 다음과 같이 enctype 이 multipart/form-data 인 폼을 통해 업로드하는 데이터의 형식을 의미합니다.

// 폼을 통해 업로드하는 파일은 body-parser 로는 처리할 수 없고 직접 파싱(해석)하기도 어려우므로 multer 라는 미들웨어를 따로 사용하면 펀리합니다.

const multer = require('multer');
const fs = require('fs').promises;
const constants = require('fs').constants;

router.get('/upload', (req,res) => {
    res.sendFile(path.join(__dirname, '/multipart.html'));
});

router.get('/upload2', (req,res) => {
    res.sendFile(path.join(__dirname, '/multipart2.html'));
});

router.get('/upload3', (req,res) => {
    res.sendFile(path.join(__dirname, '/multipart3.html'));
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req,file,done) {

            done(null, 'uploads/');
        },
        filename(req,file,done) {
            
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

function uploadAuthCheck(req,res,next) {
    fs.access('./uploads', constants.F_OK | constants.W_OK | constants.R_OK)
    .then(() => {
        next();
    })
    .catch((e) => {
        if(e.code === 'ENOENT') {
            fs.mkdir('./uploads');
            next();
        } else {
            next(new Error('not auth uploads dir'));
        }
    })
}

router.post('/upload', uploadAuthCheck, upload.single('image'), (req,res) => {
    console.log(req.file, req.body);
    res.send('ok');
});

// 파일을 하나만 업로드하는 경우에는 single 미들웨어를 사용합니다.

// 여러파일을 업로드 하는 경우 single 대신 array 로 교체합니다.

router.post('/upload2', uploadAuthCheck, upload.array('many'), (req,res) => {
    console.log(req.files, req.body);
    res.send('ok');
});

// 파일을 여러 개 업로드 하지만 input 태그나 폼 데이터의 키가 다른 경우에는 fields 미들웨어를 사용합니다.

router.post('/upload3', uploadAuthCheck, upload.fields([{name: 'image1'}, {name: 'image2'}]), (req,res) => {
    console.log(req.files, req.body);
    res.send('ok');
});

module.exports = router;