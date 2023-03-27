import { check, validationResult } from 'express-validator';
import libphonenumber from 'google-libphonenumber';
const { PhoneNumberUtil } = libphonenumber;
const phoneUtil = PhoneNumberUtil.getInstance();


const userSignUpValidationRules = () => {
    return [
        check('firstName', 'First name is required').not().isEmpty(),
        check('lastName', 'Last name is required').not().isEmpty(),
        check('email', 'Invalid email').not().isEmpty().isEmail(),
        check('password', 'Please enter a password with 8 or more characters')
            .not()
            .isEmpty()
            .isLength({ min: 8 }),
    ];
};

const userSignInValidationRules = () => {
    return [
        check('email', 'Invalid email').not().isEmpty().isEmail(),
        check('password', 'Invalid password')
            .not()
            .isEmpty()
            .isLength({ min: 8 }),
    ];
};

const checkOutValidationRules = () => {
    return [
        check('email', 'Invalid email').not().isEmpty().isEmail(),
        check('country', 'Invalid country/region').not().isEmpty(),
        check('firstName', 'Invalid first name').not().isEmpty(),
        check('lastName', 'Invalid last name').not().isEmpty(),
        check('address', 'Invalid address')
            .not()
            .isEmpty()
            .isLength({ min: 15 }),
        check('city', 'Invalid city').not().isEmpty().isLength({ min: 2 }),
        check('phone', 'Invalid phone number')
            .notEmpty()
            .withMessage('Phone number is required')
            .custom((value, { req }) => {
                const countryCodes = ['VN', 'US', 'GB'];
                const phoneNumber = value.trim();
                let valid = false;
                try {
                    const parsedNumber =
                        phoneUtil.parseAndKeepRawInput(phoneNumber);
                    const countryCode =
                        phoneUtil.getRegionCodeForNumber(parsedNumber);
                    if (countryCodes.includes(countryCode)) {
                        valid = phoneUtil.isValidNumber(parsedNumber);
                    }
                } catch (e) {
                    console.error(e);
                }

                if (!valid) {
                    throw new Error('Invalid phone number format');
                }

                return true;
            })
            .bail()
            .customSanitizer((value) => {
                const phoneNumber = value.trim();
                const parsedNumber =
                    phoneUtil.parseAndKeepRawInput(phoneNumber);
                return phoneUtil.format(parsedNumber, PhoneNumberFormat.E164);
            }),
    ];
};


const validateSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var messages = [];
        errors.array().forEach((error) => {
            messages.push(error.msg);
        });
        req.flash('error', messages);
        return res.redirect('/user/signup');
    }
    next();
};

const validateSignin = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var messages = [];
        errors.array().forEach((error) => {
            messages.push(error.msg);
        });
        req.flash('error', messages);
        return res.redirect('/user/signin');
    }
    next();
};

const validateCheckout = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var messages = [];
        errors.array().forEach((error) => {
            messages.push(error.msg);
        });
        req.flash('error', messages);
        return res.redirect('/checkout');
    }
    next();
};


export {
    userSignUpValidationRules,
    userSignInValidationRules,
    validateSignup,
    validateSignin,
};
