const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);
app.use((req,res,next) => {
    if(process.env.NODE_ENV === 'production') {
        morgan('combined')(req,res,next);
    } else {
        morgan('dev')(req,res,next);
    }
});
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.raw());
app.use(express.text());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

const indexRouter = require('./routes'); // index.js 는 생략할 수 있음
const userRouter = require('./routes/user');
const fileRouter = require('./routes/file');

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/file', fileRouter);


// 라우터가 위에 있기 때문에 다 돌고 없으면 여기로옴. 즉, 제일 마지막 순서라는것임
app.use((req,res,next) => {
    res.status(404).send('Not Found');
});

app.use((err,req,res,next) => {
    console.log('에러 처리 미들웨어', err);
    console.log('res.locals', res.locals);
    res.status(500).send(err.message);
});







app.listen(app.get('port'), () => {
    console.log(app.get('port'), ' on');
});