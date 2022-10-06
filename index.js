import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";

import userModel from "./models/user.js";
import checkAuth from "./utils/checkAuth.js";

mongoose
  .connect(
    "mongodb+srv://admin:rIbplCZpPavfbwkA@cluster0.1cogdfr.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error:", err));
const app = express();

app.use(express.json());

app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new userModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
      avatarURL: req.body.avatarURL,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretKey123",
      {
        expiresIn: "1d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Ошибка регистрации",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretKey123",
      {
        expiresIn: "1d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch {
    console.log(err);
    res.status(500).json({
      message: "Ошибка авторизации",
    });
  }
});

app.post("/auth/me", checkAuth, async (req, res) => {
    try {
        const user = await userModel.findOne(req.userId)

        if(!user){
            return res.status(404).json({
                message: "Пользователь не найден"
            }
            )
        }

        const { passwordHash, ...userData } = user._doc;

        res.json({
          ...userData
        })
    }
    catch{
        res.status(500).json({
            message: "Ошибка сессии"
        })
    }   
})

app.listen(4444, (err) => {
  if (err) {
    return console.log("Server error: ", err);
  }
  console.log("Server OK");
});
