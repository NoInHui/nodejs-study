const express = require('express');
const router = express.Router();

router.get('/', (req,res,next) => {
    // 이전 절에서 next 함수에 다음 라우터로 넘어가는 기능이 있다고 소개했는데
    // 바로 next('route') 입니다.
    // 이 기능은 라우터에 연결된 나머지 미들웨어들을 건너뛰고 싶을 때 사용합니다.
    console.log(1);
    next('route');
}, (req,res,next) => {
    console.log(2);
    console.log('실행되지 않았습니다.');
    next();
}, (req,res,next) => {
    console.log(3);
    console.log('실행되지 않았습니다.');
    next();
});

router.get('/', (req,res) => {
    console.log(4);
    res.send('Hello, Express');
});

// 첫 번째 라우터의 첫 번쨰 미들웨어에서 next() 대신 next('route') 를 호출했습니다.
// 이 경우에는 두 번쨰, 세 번째 미들웨어는 실행되지 않습니다.
// 대신 주소와 일치하는 다음 라우터로 넘어갑니다.

// 라우터에서 자주 쓰이는 활용법으로 app.route 나 router.route 가 있습니다.

// 다음과 같이 주소는 같지만 메서드는 다른 코드가 있을 때 이를 하나의 덩어리로 줄일 수 있습니다.

router.route('/abc')
.get((req,res) => {
    res.send('GET /abc');
})
.post((req,res) => {
    res.send('POST /abc');
});


// req, res 객체 살펴보기
// 익스프레스의 req, res 객체는 http 모듈의 req, res 객체를 확장한 것입니다.
// 기존 http 모듈의 메서드도 사용할 수 있고, 익스프레스가 추가한 메서드나 속성을 사용할 수도 있습니다.
// res.writeHead, res.write, res.end 메서드를 그대로 사용할 수 있으면서 res.send, res.sendFile 같은 메서드도 쓸 수 있습니다.

// req.app : req 객체를 통해 app 객체에 접근할 수 있습니다. req.app.get('port') 와 같은 식으로 사용할 수 있습니다.
// req.body : body-parser 미들웨어가 만드는 요청의 본문을 해석한 객체입니다.
// req.cookies : cookie-parser 미들웨어가 만드는 요청의 쿠키를 해석한 객체입니다.
// req.ip : 요청의 ip 주소가 담겨 있습니다.
// req.params : 라우트 매개변수에 대한 정보가 담긴 객체입니다.
// req.query : 쿼리스트링에 대한 정보가 담긴 객체입니다.
// req.signedCookies : 서명된 쿠키들은 req.cookies 대신 여기에 담겨 있습니다.
// req.get(헤더 이름) : 헤더의 값을 가져오고 싶을 때 사용하는 메서드입니다.

// res.app : req.app 처럼 res 객체를 통해 app 객체에 접근할 수 있습니다.
// res.cookie(키,값,옵션) : 쿠키를 설정하는 메서드입니다.
// res.clearCookie(키,값,옵션) : 쿠키를 제거하는 메서드입니다.
// res.end() : 데이터 없이 응답을 보냅니다.
// res.json(JSON) : JSON 형식의 응답을 보냅니다.
// res.locals : 하나의 요청 안에서 미들웨어 간에 데이터를 전달하고 싶을 때 사용하는 객체입니다.
// res.redirect(주소) : 리다이렉트할 주소와 함께 응답을 보냅니다.
// res.render(뷰,데이터) : 다음 절에서 다룰 템플릿 엔진을 렌더링해서 응답할 떄 사용하는 메서드입니다.
// res.send(데이터) : 데이터와 함께 응답을 보냅니다. 데이터는 문자열일 수도, HTML 일수도, 버퍼일수도, 객체나 배열일 수도 있습니다.
// res.sendFile(경로) : 경로에 위치한 파일을 응답합니다.
// res.set(헤더, 값) : 응답의 헤더를 설정합니다.
// res.status(코드) : 응답 시의 HTTP 상태 코드를 지정합니다.

// req 나 res 객체의 메서드는 다음과 같이 메서드 체이닝을 지원하는 경우가 많습니다.
// 메서드 체이닝을 활용하면 코드양을 줄일 수 있습니다.

// res.status(201).cookie('test',test).redirect('/admin');





module.exports = router;