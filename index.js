import express from "express";
import mongoose from "mongoose";

import { loginValidation, registerValidation, postCreateValidation } from "./validation.js";
import checkAuth from "./utils/checkAuth.js";
import * as userController from "./controllers/userController.js"
import * as postController from "./controllers/postController.js"

mongoose
  .connect(
    "mongodb+srv://admin:rIbplCZpPavfbwkA@cluster0.1cogdfr.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error:", err));
const app = express();

app.use(express.json());

app.post("/auth/register", registerValidation, userController.register);

app.post("/auth/login", loginValidation, userController.login);

app.post("/auth/me", checkAuth, userController.aboutMe)

app.get("/posts", postController.getAll)
//app.get("/posts:id", postController.getOne)
app.post("/posts", checkAuth, postCreateValidation, postController.create)
//app.delete("/posts", postController.remove)
//app.patch("/posts", postController.update)

app.listen(4444, (err) => {
  if (err) {
    return console.log("Server error: ", err);
  }
  console.log("Server OK");
});
