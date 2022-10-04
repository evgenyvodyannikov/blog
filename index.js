import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

import { registerValidation } from './validations/auth.js'

import userModel from './models/user.js'

mongoose.connect('mongodb+srv://admin:rIbplCZpPavfbwkA@cluster0.1cogdfr.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error:', err));
const app = express();

app.use(express.json());


app.post('/auth/login', (req, res) => {

    const token = jwt.sign({
        email: req.body.email,
        fullName: "Some Name",
    }, 'secretKey')

    res.json({
        success: true,
        token
    });

});

app.post('/auth/register', registerValidation, async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new userModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash,
            avatarURL: req.body.avatarURL
        });

        const user = await doc.save();

        res.json(user);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Ошибка регистрации"
        })
    }

});

app.listen(4444, (err) => {
    if (err) {
        return console.log("Server error: ", err);
    }
    console.log("Server OK");
})