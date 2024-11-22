import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "notice.html")); // 서버 점검을 알리는 웹문서를 클라이언트에 전송하는 명령
  // res.send('<h1>Hello World!</h1>')
})

app.use(express.static('public')) //'public' 자리에 폴더나 파일을 찾는다.

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})