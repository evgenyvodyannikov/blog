import { body } from 'express-validator'

export const registerValidator = [
    body('email').isEmail(),
    body('password').isLength({min: 8}),
    body('fullName').isLength({min: 2}),
    body('avatarURL').optional().isURL(),
];