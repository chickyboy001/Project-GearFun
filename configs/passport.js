import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.js';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(
    'local.signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                const user = await User.findOne({ email: email });
                if (user) {
                    return done(null, false, {
                        message: 'Email already exists',
                    });
                }
                if (password != req.body.password2) {
                    return done(null, false, {
                        message: 'Passwords must match',
                    });
                }
                const newUser = await new User();
                newUser.email = email;
                newUser.password = newUser.encryptPassword(password);
                newUser.firstName = req.body.firstName;
                newUser.lastName = req.body.lastName;
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    )
);

passport.use(
    'local.signin',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: false,
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email });
                if (!user) {
                    return done(null, false, { message: "User doesn't exist" });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Wrong password' });
                }
                return done(null, user);
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    )
);
