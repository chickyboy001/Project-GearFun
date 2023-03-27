// import dependencies
import express from 'express';
import mongoose from 'mongoose';
import expbs from 'express-handlebars';
import path from 'path';
import logger from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import moment from 'moment/moment.js';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';
import cors from 'cors';
import Category from './models/category.js';
import handlebarsHelpers from 'handlebars-helpers';
const helpers = handlebarsHelpers();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import connectDB from './configs/db.js';

const app = express();
dotenv.config();
import './configs/passport.js';

// mongodb configuration
connectDB();

const PORT = process.env.PORT || 4000;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_CLUSTER = process.env.DB_CLUSTER;
const DB_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.ke1d3qc.mongodb.net/GearFun?retryWrites=true&w=majority`;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const hbs = expbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },

    helpers: {
        helpers,
        multiplication: function (a, b) {
            return a * b;
        },
        for: function (i, current, pages, home) {
            let result = [];
            for (i; i <= Number(current) + 4 && i <= pages; i++) {
                if (i == current) {
                    result.push(`<li><a class="active">${i}</a></li>`);
                } else {
                    result.push(`<li>
                            <a class="" href="${home}page=${i}">${i}</a>
                        </li>`);
                }
                if (i == Number(current) + 4 && i < pages) {
                    result.push('<li><a class="">...</a></li>');
                }
            }
            return result.join('\n');
        },
        itemAtArr: function (arr, index) {
            return arr[index];
        },
        getPrice: function (obj, key) {
            return obj.versions[key].price;
        },
        getImage: function (arr) {
            let result;
            for (let i = 0; i < 1; i++) {
                result = arr[i];
                break;
            }
            return result;
        },
        currTemp: function (a) {
            return Number(a);
        },
        pageTemp: function (a) {
            return a;
        },
        iFromCurrent: function (current) {
            var i = Number(current) > 5 ? Number(current) - 4 : 1;
            return i;
        },
        pageDisable: function (i, current, pages) {
            return i == Number(current) + 4 && i < pages;
        },
        convertToJSON: function (object) {
            return JSON.stringify(object);
        },
        formatDate: function (date) { 
            return moment(date).format('HH:mm DD-MM-YYYY');
        },
        html: function (html) {
            try {
                return new hbs.SafeString(html);
            } catch (error) {
                console.log(error);
            }
        }
    },
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    cors({
        credentials: true,
        origin: ['http://localhost:3000'],
    })
);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: DB_URL,
            dbName: 'GearFun_DB',
        }),
        //session expires after 14 days
    })
);
// app.use(csurf());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// global variables across routes
app.use(async (req, res, next) => {
    try {
        res.locals.login = req.isAuthenticated();
        res.locals.session = req.session;
        res.locals.currentUser = req.user;
        const categories = await Category.find({}).sort({ title: 1 }).exec();
        res.locals.categories = categories;
        let cartCount = 0;
        if (req.session.cart) {
            let cart = req.session.cart;
            cartCount = cart.items.length;
        }
        res.locals.cartCount = cartCount;
        next();
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

//routes config
import shopRoutes from './routes/shop.js';
import adminRoutes from './routes/admin.js';
import productsRouter from './routes/products.js';
import userRouter from './routes/user.js';
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/products', productsRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: '404 Not Found' });
});

app.set('port', PORT);
app.listen(PORT, () => {
    console.log('Server running at port ' + PORT);
});

export default app;
