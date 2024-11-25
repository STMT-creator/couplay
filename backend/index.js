import express from "express";
import { type } from "os";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
const users = [];
import bcrypt from "bcrypt"; // 암호화 알고리즘을 사용하게 해주는 자바스크립트 파일
import { hash } from "crypto";
const saltRounds = 10;

import mongoose from "mongoose";
const uri =
  "mongodb+srv://cloudtail:demo1234@cluster0.i0c0v.mongodb.net/myapp?retryWrites=true&w=majority&appName=Cluster0";
async function run() {
  try {
    const result = await mongoose.connect(uri);
    if (result) {
      console.log(
        "==================== MongoDB Atlas is connected ===================="
      );
    } else {
      console.log(
        "==================== MongoDB Atlas is failed ===================="
      );
    }
  } catch (err) {
    console.log("에러 :", err);
    throw new Error("몽고DB 데이터베이스 연결 오류!");
  }
}
run().catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  role: {
    type: String
  },
  id: {
    type: String,
    length: 8,
    lowercase: true
  },
  pwd: {
    type: String,
    maxlength: 12
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number
  },
  sms: {
    type: String,
    enum: ["1", "0"]
  },
  email: {
    type: String,
    trim: true
  },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

app.use(express.static("public")); //'public' 자리에 폴더나 파일을 찾는다.
app.use(express.json()); //요청 바디 분석
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "notice.html"));
});

app.get("/signup", (req, res) => {
  res.send("/signup 페이지를 보고 계십니다.");
});

app.post("/signup", (req, res) => {
  try {
    const {
      user_type,
      user_id,
      user_pwd,
      user_name,
      user_phone,
      user_sms,
      user_email
    } = req.body;
    bcrypt.hash(user_pwd, saltRounds, async function (err, hash) {
      console.log("해싱처리된 암호 :", hash);
    const user = await User.create({
      role: user_type,
      id: user_id,
      pwd: user_pwd,
      name: user_name,
      phone: user_phone,
      sms: user_sms,
      email: user_email
    })
  });
  if (!User) {
    throw new Error("사용자 생성 실패!");
  } res.status(200).json(User);
} catch (err) {
  console.log(err)
  // throw new Error("회원가입 오류!");
} 
});

app.post("/signin", (req, res) => {
  res.send("/signin 페이지를 보고 계십니다.");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
