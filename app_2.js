// 미들웨어를 통해 요청과 응답에 다양한 기능을 추가할 수 있고, 이미 많은 사람이 유용한 기능들을 패키지로 만들어뒀습니다.
// 실무에서 자주 사용하는 패키지들을 설치해봅시다.
// npm i morgan cookie-parser express-session dotenv

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COO))



app.use((req,res,next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
});

app.get('/', (req,res,next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req,res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});

app.use((err,req,res,next) => {
    console.log(err);
    res.status(500).send(err.message);
});


app.listen(app.get('port'), () => {
    console.log(app.get('port'), ' on');
});