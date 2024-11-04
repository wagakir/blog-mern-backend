import { body } from "express-validator";

export const registerValidation = [
  body("email", "Некорректный формат почты").isEmail(),
  body("password", "Пароль не соответсвует длине").isLength({ min: 5 }),
  body("fullName", "Введите имя").isLength({ min: 2 }),
  body("avatarUrl", "Некорректная ссылка на аватар").optional().isURL(),
];
export const loginValidation = [
  body("email", "Некорректный формат почты").isEmail(),
  body("password", "Пароль не соответсвует длине").isLength({ min: 5 }),
];
