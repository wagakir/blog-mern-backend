import { body } from "express-validator";

export const postCreateValidation = [
  body("title", "Введите заголовок статьи")
    .isLength({
      min: 3,
    })
    .isString(),
  body("text", "Введите текст статьи (более 10 символов) ")
    .isLength({
      min: 10,
    })
    .isString(),
  body("tags", "Неверный формат тэгов").optional().isArray(),
  body("imageUrl", "Некорректная ссылка на изображение").optional().isURL(),
];
