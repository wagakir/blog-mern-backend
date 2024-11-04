import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { loginValidation, registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import { postCreateValidation } from "./validations/post.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import { unlinkSync } from "node:fs";

import { configDotenv } from "dotenv";
configDotenv();

mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("db connected"))
  .catch((err) => console.log("db error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    const now = new Date();
    cb(null, now.getTime() + file.originalname);
  },
});

const upload = multer({ storage });
// const require = createRequire(import.meta.url);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), async (req, res) => {
  try {
    res.json({ url: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Не удалось загрузить изображение" });
  }
});

app.delete("/upload/:id", checkAuth, async (req, res) => {
  try {
    const pathImage = "uploads/" + req.params.id;
    await unlinkSync(pathImage);
    res.json({ msg: "succes" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Не удалось удалить изображение" });
  }
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", postCreateValidation, checkAuth, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server start");
});
