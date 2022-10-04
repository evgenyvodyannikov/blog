import express from 'express';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import { validationResult } from 'express-validator'

import { registerValidation } from './validations/auth.js'

mongoose.connect('mongodb+srv://admin:rIbplCZpPavfbwkA@cluster0.1cogdfr.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('DB OK'))
.catch((err) => console.log('DB error:', err));
const app =  express();

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

app.post('/auth/register', registerValidation, (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json(errors.array());
  }

  res.json({
    success: true,
  });


});

app.listen(4444, (err) => {
    if(err){
        return console.log("Server error: ", err);
    }
    console.log("Server OK");
})