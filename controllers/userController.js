import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import userModel from "../models/user.js";

export const register = async (req, res) => {
    try {
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
};

export const login = async (req, res) => {
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
};

export const aboutMe = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.userId})
        
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
};