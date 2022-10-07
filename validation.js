import { body } from 'express-validator'

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль не может содержать менее 8 символов').isLength({min: 8}),
    body('fullName', 'Укажите имя').isLength({min: 2}),
    body('avatarURL', 'Неверная ссылка на фото').optional().isURL()
];

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль не может содержать менее 8 символов').isLength({min: 8})
];