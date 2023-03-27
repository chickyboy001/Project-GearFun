
import Product from '../models/product.js';
import Cart from '../models/cart.js';
import Order from '../models/order.js';
import User from '../models/user.js';



export async function signIn(req, res) { 
    var errorMsg = req.flash('error')[0];
    res.render('user/signin', {
        errorMsg,
        title: 'Login',
    });
}

export async function signInHandler(req, res) { 
    try {
        // cart logic when the user logs in
        let cart = await Cart.findOne({ user: req.user._id });
        // if there is a cart session and user has no cart, save it to the user's cart in db
        if (req.session.cart && !cart) {
            const cart = new Cart(req.session.cart);
            cart.user = req.user._id;
            await cart.save();
        }
        // if user has a cart in db, load it to session
        if (cart) {
            req.session.cart = cart;
        }
        // redirect to old URL before signing in
        if (req.session.oldUrl) {
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
        } else {
            res.redirect('/user/account');
        }
    } catch (err) {
        console.log(err);
        req.flash('error', err.message);
        return res.redirect('/');
    }
}

export async function signUp(req, res) { 
    var errorMsg = req.flash('error')[0];
    res.render('user/signup', {
        errorMsg,
        title: 'Sign Up',
    });
}

export async function signUpHandler(req, res) { 
    try {
        //if there is cart session, save it to the user's cart in db
        if (req.session.cart) {
            const cart = new Cart(req.session.cart);
            cart.user = req.user._id;
            await cart.save();
        }
        // redirect to the previous URL
        if (req.session.oldUrl) {
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
        } else {
            res.redirect('/user/profile');
        }
    } catch (err) {
        console.log(err);
        req.flash('error', err.message);
        return res.redirect('/');
    }
}

export async function account(req, res) {
    const successMsg = req.flash('success')[0];
    const errorMsg = req.flash('error')[0];
    try {
        // find all orders of this user
        const allOrders = await Order.find({ 'customer.user': req.user }).sort(
            { createdAt: -1 }
        );
        res.render('user/account', {
            orders: allOrders,
            errorMsg,
            successMsg,
            title: 'User Profile',
        });
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
}

export async function addAddress(req, res) {
    try {
        const {
            country,
            firstName,
            lastName,
            address1,
            address2,
            city,
            postal,
            phone,
            setDefault
        } = req.body;
        const user = await User.findById(req.user._id);
        user.address.push({
            firstName: firstName,
            lastName: lastName,
            country: country,
            address1: address1,
            address2: address2,
            city: city,
            postalCode: postal,
            phone: phone,
        });
        user.save();
        req.flash('success', 'New address added successfully!');
        res.redirect(req.headers.referer);
    } catch (error) {
        req.flash('error', 'Add new address failed!');
        console.error(error);
    }
}

export async function orderDetails(req, res) {
    try {
        const order = await Order.findById(req.params.id);
        res.render('user/orderDetails', {
            order: order,
            title: 'Order details',
        });
    } catch (err) {
        console.error(err);
    }
}

export function logout(req, res) {
    try {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.session.cart = null;
            res.redirect('/');
        });
    } catch (err) {
        console.error(err);
    }
}
