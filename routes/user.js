import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import {
    signIn,
    signInHandler,
    signUp,
    signUpHandler,
    account,
    addAddress,
    orderDetails,
    logout,
} from '../controllers/user.js';
import {
    userSignUpValidationRules,
    userSignInValidationRules,
    validateSignup,
    validateSignin,
} from '../configs/validator.js';
import middleware from '../middleware/index.js';

const router = express.Router();

router.get('/signin', middleware.isNotLoggedIn, signIn);

router.post(
    '/signin',
    [
        middleware.isNotLoggedIn,
        userSignInValidationRules(),
        validateSignin,
        passport.authenticate('local.signin', {
            failureRedirect: '/user/signin',
            failureFlash: true,
        }),
    ],
    signInHandler
);

router.get('/signup', middleware.isNotLoggedIn,  signUp);

router.post(
    '/signup',
    [
        middleware.isNotLoggedIn,
        userSignUpValidationRules(),
        validateSignup,
        passport.authenticate('local.signup', {
            successRedirect: '/user/profile',
            failureRedirect: '/user/signup',
            failureFlash: true,
        }),
    ],
    signUpHandler
);

router.get('/account', middleware.isLoggedIn, account);

router.post('/addAddress', middleware.isLoggedIn, addAddress);

router.get('/orderDetails/:id', middleware.isLoggedIn, orderDetails);

router.get('/logout', middleware.isLoggedIn, logout);

export default router;