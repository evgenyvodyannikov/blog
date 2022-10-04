import express from 'express';
import jwt from 'jsonwebtoken'
const app =  express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world!');
})

app.post('/login', (req, res) => {

    const token = jwt.sign({
        email: req.body.email,
        fullName: "Some Name",
    }, 'secretKey')

    res.json({
        success: true,
        token
    });

})

app.listen(4444, (err) => {
    if(err){
        return console.log("Server error: ", err);
    }
    console.log("Server OK");
})