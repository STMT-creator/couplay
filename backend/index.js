import express from 'express'
import { type } from 'os';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000
const users = [];
import bcrypt from "bcrypt" // 암호화 알고리즘을 사용하게 해주는 자바스크립트 파일
import { hash } from 'crypto';
const saltRounds = 10; // 복호화 횟수 => 값이 클수록 복잡하게 암호화됨
const myPlaintextPassword = 's0/\/\P4$$w0rD'; // 직접 비교를 위해 설정
const someOtherPlaintextPassword = 'not_bacon';

app.use(express.static('public')) //'public' 자리에 폴더나 파일을 찾는다.
app.use(express.json()); //요청 바디 분석
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "notice.html"))
})

app.get('/signup', (req, res) => {
  res.send("/signup 페이지를 보고 계십니다.");
})

app.post('/signup', (req, res) => {
  const { user_type, user_id, user_pwd, user_name, user_phone, user_sms, user_email, user_file } = req.body;
  bcrypt.hash(user_pwd, saltRounds, function(err, hash) {
    console.log("해싱처리된 암호 :", hash)
});
  users.push({
    id: user_id,
    name: user_name,
    pwd: hash,
    phone: user_phone,
    sms: user_sms ? "y": "n",
    email: user_email,
    file: user_file,
    type: user_type
  });
  console.log(users);
  res.send("회원가입이 완료되었습니다.");
})

app.post('/signin', (req, res) => {
  res.send("/signin 페이지를 보고 계십니다.")
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})