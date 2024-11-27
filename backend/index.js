import express from "express";
import { type } from "os";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
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

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
    },
    id: {
      type: String,
      unique: true,
      minlength: 8,
      lowercase: true,
      required: true,
    },
    pwd: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    sms: {
      type: String,
      enum: ["y", "n"],
    },
    email: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

app.use(cookieParser("secrectString")); // 쿠키 굽기
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
      user_email,
    } = req.body;
    bcrypt.hash(user_pwd, saltRounds, async function (err, hash) {
      console.log("해싱처리된 암호 :", hash);
      const user = await User.create({
        role: user_type,
        id: user_id,
        pwd: hash,
        name: user_name,
        phone: user_phone,
        sms: user_sms,
        email: user_email,
      }); console.log(user);
      if (!user) {
        throw new Error("사용자 생성 실패!");
      }
      // res.status(200).json({
      //   status: "ok",
      //   message: "회원가입 완료",
      // });
      // 회원가입 성공하면, 현재 회원의 ID 등의 정보를 cookie로 저장해서 client에 전송
      // client가 server에 요청(request)할 때 쿠키 정보를 http header에 담아서
      res.send(
        '<script>alert("회원가입 성공, 로그인 페이지로 이동합니다.");location.href="/";</script>'
      );
    });
  } catch (err) {
    console.log(err);
    // throw new Error("회원가입 오류!");
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { user_id, user_pwd } = req.body;
    const foundUser = await User.find({ id: user_id });
    if (!foundUser) {
      res.status(401).json({
        status: 'fail',
        message: "사용자가 존재하지 않습니다."
      })
    }
    const match = await bcrypt.compare(user_pwd, foundUser[0].pwd)
    if(match) {
      // 로그인 성공 쿠키 : 사용자 ID, 이름 등의 로그인 정보들 기록
      const loginInfo = JSON.stringify({
        login_id: foundUser[0].id,
        user_name: foundUser[0].name,
        user_email: foundUser[0].email,
        user_createdAt: foundUser[0].createdAt
      })
      res.cookie('login_user', foundUser[0].id, {
        httpOnly: true,
        maxAge: 60000, // 1000분의 1 초로 계산 따라서 60,000은 60초로 1분 후 쿠키 삭제
        path: '/'
      })
      res.status(200).json({
        status: 'success',
        message: '로그인 성공'
      })
    } else {
      res.status(200).json({
        status: 'fail',
        message: '로그인 실패'
      })
    }
    // res.send("/signin 페이지를 보고 계십니다.");
  } catch (err) {
    console.log(err);
  }
});

app.get("/bucket", (req, res) => {
  if (req.cookies.login_user) {
      console.log(req.cookies.login_user);
      res.send("쿠키정보가 존재합니다.")
  } else {
    res.status(401).json({
      status: "fail",
      message: "로그인이 필요합니다."
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
