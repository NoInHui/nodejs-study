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

// 설치했던 패키지들을 불러온 뒤 app.use 로 연결합니다.
// req,res,next 같은 것들이 보이지 않아 당황스러울 수도 있는데, 미들웨어 내부에 들어 있습니다.
// next 도 내부적으로 호출하기에 다음 미들웨어로 넘어갈 수 있습니다.

// dotenv 패키지는 .env 파일을 읽어서 process.env 로 만듭니다.
// dotenv 패키지의 이름이 dot(점) + env 인 이유입니다.

// morgan
// 기존 로그 외 추가적인 로그를 볼 수 있습니다.
// GET / 500 11.157 ms - 50 로그는 morgan 미들웨어에서 나오는 것입니다.
// 요청과 응답에 대한 정보를 콘솔에 기록합니다.
// 인수로 dev 외에 combined, common, short, tiny 등을 넣을 수 있습니다.
// 개발할떄는 dev , 운영중일땐 combined 쓰는게 좋음

// app.use(morgan('dev'));
// app.use(morgan('combined'));

// static
// static 미들웨어는 정적인 파일들을 제공하는 라우터 역할을 합니다.
// 기본적으로 제공되기에 따로 설치할 필요 없이 express 객체 안에서 꺼내 장착하면 됩니다.

// app.use('요청 경로', express.static('실제 경로'));
app.use('/', express.static(path.join(__dirname, 'public')));
// 서버의 폴더 경로와 요청 경로가 다르므로 외부인이 서버의 구조를 쉬벡 파악할 수 없습니다.
// 이는 보안에 큰 도움이 됩니다.


// body-parser
// 요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어입니다.
// 보통 폼 데이터나 ajax 요청의 데이터를 처리합니다.
// 단, 멀티파트(이미지,동영상,파일) 데이터는 처리하지 못합니다.
// 이 경우에는 뒤에 나오는 multer 모듈을 사용하면 됩니다.

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// 다른 책이나 코드에서 body-parser 를 설치하는 것을 볼수도 있습니다.
// 하지만 익스프레스 4.17.0 버전부터 body-parser 미들웨어의 기능이 익스프레스에 내장되었으므로 따로 설치할 필요가 없습니다.

// 익스프레스는 JSON 과 URL-encoded 형식의 데이터 외에도 Raw, Text 형식의 데이터를 추가로 해석할 수 있습니다.
// Raw 는 요청의 본문이 버퍼 데이터일 때, Text 는 텍스트 데이터일 때 해석하는 미들웨어 입니다.

app.use(express.raw());
app.use(express.text());

// JSON 은 JSON 형식의 데이터 전달 방식이고
// URL-encoded 는 주소 형식으로 데이터를 보내는 방식입니다.
// 폼 전송은 URL-encoded 방식을 주로 사용합니다.
// urlencoded 메서드를 보면 {extended:false} 라는 옵션이 들어 있습니다.
// 이 옵션이 false 면 노드의 querystring 모듈을 사용해 쿼리스트링을 해석하고
// true 이면 qs 모듈을 사용해 쿼리스트링을 해석합니다.
// qs 모듈은 내장모듈이 아니라 npm 패키지이며, querystring 모듈의 기능을 좀 더 확장한 모듈입니다.


// cookie-parser
// cookie-parser 는 요청에 동봉된 쿠키를 해석해 req.cookies 객체로 만듭니다.

app.use(cookieParser(process.env.COOKIE_SECRET));

// 첫 번째 인수로 비밀 키를 넣어줄 수 있습니다.
// 서명된 쿠키가 있는 경우, 제공한 비밀 키를 통해 해당 쿠키가 내 서버가 만든 쿠키임을 검증할 수 있습니다.
// cookie-parser 가 쿠키를 생성할 때 쓰이는 것은 아닙니다.
// 쿠키를 생성/제거 하려면 res.cookie , res.clearCookie 메서드를 사용해야합니다.

/** 
res.cookie('name', 'zerocho', { 
    expires: new Date(Date.now() + 900000),
    httpOnly: true, 
    secure: true,
});
res.clearCookie('name', 'zerocho', { httpOnly: true, secure: true });
*/


// express-session
// 세션 관리용 미들웨어 입니다.
// 로그인 등의 이유로 세션을 구현하거나 특정 사용자를 위한 데이터를 임시적으로 저장해둘 때 매우 유용합니다.
// 세션은 사용자별로 req.session 객체 안에 유지됩니다.

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

// express-session 은 인수로 세션에 대한 설정을 받습니다.
// resave : 요청이 올 떄 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정
// saveUninitialized : 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정

// express-session 은 세션 관리 시 클라이언트에 쿠키를 보냅니다.
// 안전하게 쿠키를 전송하려면 쿠키에 서명을 추가해야 하고, 쿠키를 서명하는 데 secret 의 값이 필요합니다.
// cookie-parser 의 secret 과 같게 설정하는 것이 좋습니다.
// 세션 쿠키의 이름은 name 옵션으로 설정합니다. 기본 이름은 connect.sid 입니다.

// store 라는 옵션도 있습니다.
// 현재 메모리에 세션을 저장하도록 되어 있습니다.
// 문제는 서버를 재시작하면 메모리가 초기화되어 세션이 모두 사라진다는 것입니다.
// 따라서 배포 시에는 store 에 데이터베이스를 연결해 세션을 유지하는 것이 좋습니다.
// 보통 레디스가 자주 쓰입니다.
/**
req.session.name = 'inhui'; // 세션등록
req.sessionID; // 세션 아이디 확인
req.session.destroy(); // 세션 모두 제거
 */



// 미들웨어 특성 활용하기

// 미들웨어의 특성을 총정리해봅시다.

// 미들웨어는 req,res,next 를 매개변수로 갖는 함수(에러 처리 미들웨어만 예외적으로 err,req,res,next 를 가집니다.)로서
// app.use 나 app.get, app.post 등으로 장착합니다.
/**
app.use(
    morgan('dev'),
    express.static('/', path.join(__dirname, 'public')),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(process.env.COOKIE_SECRET),
);
 */

// 위와 같이 동시에 여러 개의 미들웨어를 장착할 수도 있으며, 다음 미들웨어로 넘어가려면 next 함수를 호출해야 합니다.
// 위 미들웨어들은 내부적으로 next 를 호출하고 있으므로 연달아 쓸 수 있습니다.
// next 를 호출하지 않는 미들웨어는 res.send, res.sendFile 등의 메서드로 응답을 보내야 합니다.
// express.static 과 같은 미들웨어는 정적 파일을 제공할 때 next 대신 res.sendFile 메서드로 응답을 보냅니다.
// 따라서 정적 파일을 제공하는 경우 express.json, express.urlendoced, cookieParser 미들웨어는 실행되지 않습니다.
// 미들웨어 장착 순서에 따라 어떤 미들웨어는 실행되지 않을 수도 있다는 것을 기억해둡니다.

// 만약 next 도 호출하지 않고 응답도 보내지 않으면 클라이언트는 응답을 받지 못해 하염없이 기다리게 됩니다.=

// 지금까지 next 에 아무런 인수를 넣지 않았지만 next 함수에 인수를 넣을 수 있습니다.
// 단, 인수를 넣는다면 특수한 동작을 합니다.
// route 라는 문자열을 넣으면 다음 라우터의 미들웨어로 바로 이동하고
// 그 외의 인수를 넣는다면 바로 에러 처리 미들웨어로 이동합니다.
// 이때의 인수는 에러 처리 미들웨어의 err 매개변수가 됩니다.
// 라우터에서 에러가 발생할 때 에러를 next(err) 를 통해 에러 처리 미들웨어로 넘깁니다.

// 미들웨어 간에 데이터를 전달하는 방법도 있습니다.
// 세션을 사용한다면 req.session 객체에 데이터를 넣어도 되지만
// 세션이 유지되는 동안에 데이터도 계속 유지된다는 단점도 있습니다.
// 만약 요청이 끝날 떄까지만 데이터를 유지하고 싶다면 res.locals 객체에 데이터를 넣어두면 됩니다.
// 새로운 요청이 오면 res.locals 는 초기화 됩니다.


// 미들웨어를 사용할 때 유용한 패턴 한 가지를 소개합니다.
// 미들웨어 안에 미들웨어를 넣는 방식입니다.
// 아래 두 방식은 같은 기능을 합니다.

// app.use(morgan('combined'));

// app.use((req,res,next) => {
//     morgan('combined')(req,res,next);
// });

// 이 패턴이 유용한 이유는 기존 미들웨어의 기능을 확장할 수 있기 떄문입니다.

app.use((req,res,next) => {
    if(process.env.NODE_ENV === 'production') {
        morgan('combined')(req,res,next);
    } else {
        morgan('dev')(req,res,next);
    }
});

// app.use((req,res,next) => {
//     console.log('모든 요청에 다 실행됩니다.');
//     next();
// });

app.get('/', (req,res,next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    res.locals.data = '데이터 넣기';
    next();
}, (req,res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});

app.use((err,req,res,next) => {
    console.log('에러 처리 미들웨어', err);
    console.log('res.locals', res.locals);
    res.status(500).send(err.message);
});







app.listen(app.get('port'), () => {
    console.log(app.get('port'), ' on');
});