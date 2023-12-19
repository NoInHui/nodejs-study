const express = require('express');

// Express 모듈을 실행해 app 변수에 할당합니다.
// 익스프레스 내부에 http 모듈이 내장되어 있으므로 서버의 역할을 할 수 있습니다.
const app = express();
app.set('port', process.env.PORT || 3000);

// GET 요청 외에도 POST, PUT, PATCH, DELETE, OPTIONS 에 대한 라우터를 위한 메서드가 존재합니다.
app.get('/', (req,res) => {
    res.send('Hello Express');
    // 익스프레스에서는 res.write, res.end 대신 res.send 를 사용하면 됩니다.
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), ' on');
});


