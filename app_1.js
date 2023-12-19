const express = require('express');
const path = require('path');

const app = express();
app.set('port', process.env.PORT || 3000);


// 미들웨어는 익스프레스의 핵심입니다.
// 요청과 응답의 중간(middle)에 위치하기 때문에 미들웨어(middleware)라고 부르는 것입니다.
// 뒤에 나오는 라우터와 에러 핸들러 또한 미들웨어의 일종이므로 미들웨어가 익스프레스의 전부라고 해도 과언이 아닙니다.
// 미들웨어는 요청과 응답을 조작해 기능을 추가하기도 하고, 나쁜 요청을 걸러내기도 합니다.
// 미들웨어는 app.use 와 함께 사용됩니다.
// app.use(미들웨어)

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

// app.use 에 매개변수가 req,res,next 인 함수를 넣으면 됩니다.
// 미들웨어는 위에서부터 아래로 순서대로 실행되면서 요청과 응답 사이에 특별한 기능을 추가할 수 있습니다.
// 이번에는 next 라는 세 번째 매개변수를 사용했는데, 다음 미들웨어로 넘어가는 함수입니다.
// next 를 실행하지 않으면 다음 미들웨어가 실행되지 않습니다.


app.listen(app.get('port'), () => {
    console.log(app.get('port'), ' on');
});