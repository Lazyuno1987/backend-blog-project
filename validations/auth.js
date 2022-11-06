import { body } from 'express-validator';


export const registerValidation = [
    body('email', "Invalide email").isEmail(),
    body('password', "invalid password").isLength({ min: 5 }),
    body('name', "Name is uncorrect").isLength({ min: 3 }),
    body('avatarUrl', "Invalid URL").optional().isURL(),
]

export const loginValidation = [
    body('email', "Invalide email").isEmail(),
    body('password', "invalid password").isLength({ min: 5 })
   
]

export const postValidation=[
 body('title', "Enter title").isLength({min:3}),
    body('text', "Enter text").isLength({min:10}),
    body('tags', "Enter tags").optional().isString(),
    body('imageUrl', "Enter imageUrl").optional().isString(),
]


export const commentValidation = [
    body('comment', "Enter comment").isLength({ min: 10 }),
   
]
