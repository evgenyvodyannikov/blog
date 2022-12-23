import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors';
import fs from 'fs';

import { loginValidation, registerValidation, postCreateValidation } from "./validation.js";
import { getOne, getAll, getLastTags, create, remove, update, register, login, aboutMe } from "./controllers/index.js"
import { checkAuth, handleValidationsErrors } from "./utils/index.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error:", err));
const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) =>{
    if(fs.existsSync('uploads')){
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post("/auth/register", registerValidation, handleValidationsErrors, register);
app.post("/auth/login", loginValidation, handleValidationsErrors, login);
app.post("/auth/me", checkAuth, aboutMe)

app.post("/upload", checkAuth, upload.single('image'), (req, res) =>{
  res.json({
    url: `uploads/${req.file.originalname}`,
  })
})
app.get("/tags", getLastTags)
app.get("/posts", getAll)
app.get("/posts/tags", getLastTags)
app.get("/posts/:id", getOne)
app.post("/posts", checkAuth, postCreateValidation, handleValidationsErrors, create)
app.delete("/posts/:id", checkAuth, remove)
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationsErrors, update)

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log("Server error: ", err);
  }
  console.log("Server OK");
});
