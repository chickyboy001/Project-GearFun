import mongoose from 'mongoose';
import Product from '../models/product.js';
import Cart from '../models/cart.js';
import Order from '../models/order.js';
import nodemailer from 'nodemailer';

export async function getHomePage(req, res) {
    const products = await Product.find({})
        .populate('category')
        .limit(3)
        .exec();
    const priceArr = [];
    for (const product of products) {
        const [firstKey] = product.versions.keys();
        priceArr.push(product.versions.get(firstKey).price);
    }
    res.render('home', { title: 'Gear Fun', products, priceArr });
}


export async function addToCart(req, res) {
    const { productId, key_version, key_switch, quantity } = req.body;
    try {
        // get the correct cart, either from the db, session, or an empty cart.
        let user_cart;
        if (req.user) {
            user_cart = await Cart.findOne({ user: req.user._id });
        }
        let cart;
        if (
            (req.user && !user_cart && req.session.cart) ||
            (!req.user && req.session.cart)
        ) {
            cart = new Cart(req.session.cart);
        } else if (!req.user || !user_cart) {
            cart = new Cart({});
        } else {
            cart = user_cart;
        }

        // add the product to the cart
        const product = await Product.findById(productId);
        const qtyInStock = product.versions
            .get(key_version)
            .switches.get(key_switch).quantity;
        if (qtyInStock < quantity) {
            throw new Error('Error: Not enough products in stock!');
        }
        const prodName = product.name;
        const version = product.versions.get(key_version);
        const price = version.price;
        const itemIndex = cart.items.findIndex(
            (p) =>
                p.productId == productId &&
                p.version == key_version &&
                p.switch == key_switch
        );
        if (itemIndex > -1) {
            // if product exists in the cart, update the quantity
            cart.items[itemIndex].qty += Number(quantity);
            cart.totalQty += Number(quantity);
            cart.totalCost += cart.items[itemIndex].price * Number(quantity);
        } else {
            // if product does not exists in cart, find it in the db to retrieve its price and add new item
            cart.items.push({
                productId: productId,
                prodName: prodName,
                qty: quantity,
                price: price,
                version: key_version,
                switch: key_switch,
            });
            cart.totalQty += Number(quantity);
            cart.totalCost += price * Number(quantity);
        }
        // if the user is logged in, store the user's id and save cart to the db
        if (req.user) {
            cart.user = req.user._id;
            await cart.save();
        }
        req.session.cart = cart;
        req.flash('success', 'Item added to the shopping cart!');
        res.redirect(req.headers.referer);
    } catch (err) {
        console.log(err.message);
        req.flash('error', err.message);
        res.redirect(req.headers.referer);
    }
}

export async function buyNow(req, res) {
    const { productId, key_version, key_switch, quantity } = req.body;
    try {
        // get the correct cart, either from the db, session, or an empty cart.
        let user_cart;
        if (req.user) {
            user_cart = await Cart.findOne({ user: req.user._id });
        }
        let cart;
        if (
            (req.user && !user_cart && req.session.cart) ||
            (!req.user && req.session.cart)
        ) {
            cart = new Cart(req.session.cart);
        } else if (!req.user || !user_cart) {
            cart = new Cart({});
        } else {
            cart = user_cart;
        }

        // add the product to the cart
        const product = await Product.findById(productId);
        const qtyInStock = product.versions
            .get(key_version)
            .switches.get(key_switch).quantity;
        if (qtyInStock < quantity) {
            throw new Error('Error: Not enough products in stock!');
        }
        const prodName = product.name;
        const version = product.versions.get(key_version);
        const price = version.price;
        const itemIndex = cart.items.findIndex(
            (p) =>
                p.productId == productId &&
                p.version == key_version &&
                p.switch == key_switch
        );
        if (itemIndex > -1) {
            // if product exists in the cart, update the quantity
            cart.items[itemIndex].qty += Number(quantity);
            cart.totalQty += Number(quantity);
            cart.totalCost += cart.items[itemIndex].price * Number(quantity);
        } else {
            // if product does not exists in cart, find it in the db to retrieve its price and add new item
            cart.items.push({
                productId: productId,
                prodName: prodName,
                qty: quantity,
                price: price,
                version: key_version,
                switch: key_switch,
            });
            cart.totalQty += Number(quantity);
            cart.totalCost += price * Number(quantity);
        }
        // if the user is logged in, store the user's id and save cart to the db
        if (req.user) {
            cart.user = req.user._id;
            await cart.save();
        }
        req.session.cart = cart;
        res.redirect('/checkout');
    } catch (err) {
        console.log(err.message);
        req.flash('error', err.message);
        res.redirect(req.headers.referer);
    }
}

export async function shoppingCart(req, res, next) {
    const successMsg = req.flash('success')[0];
    const errorMsg = req.flash('error')[0];
    try {
        // find the cart, whether in session or in db based on the user state
        let cart_user;
        if (req.user) {
            cart_user = await Cart.findOne({ user: req.user._id });
        }
        console.log(cart_user);
        // if user is signed in and has cart, load user's cart from the db
        if (req.user && cart_user) {
            req.session.cart = cart_user;
            return res.render('shop/cart', {
                cart: cart_user,
                title: 'Shopping Cart',
                products: await productsFromCart(cart_user),
                successMsg,
                errorMsg,
            });
        }
        // if there is no cart in session and user is not logged in, cart is empty
        if (!req.session.cart) {
            return res.render('shop/cart', {
                cart: null,
                title: 'Shopping Cart',
                products: null,
            });
        }

        // otherwise, load the session's cart
        return res.render('shop/cart', {
            cart: req.session.cart,
            title: 'Shopping Cart',
            products: await productsFromCart(req.session.cart),
            successMsg,
            errorMsg,
            // layout: false
        });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
}

export async function updateCart(req, res, next) {
    const note = req.body.note;
    const qty = req.body.updateQty;
    let cart;
    try {
        if (req.user) {
            cart = await Cart.findOne({ user: req.user._id });
        } else if (req.session.cart) {
            cart = new Cart(req.session.cart);
        }

        // update quantity
        let count = 0;
        if (qty) {
            cart.totalQty = 0;
            cart.totalCost = 0;
            for (const item of cart.items) {
                let updateQty;
                if (typeof qty == 'string') {
                    updateQty = qty;
                } else {
                    updateQty = qty[count];
                }

                const product = await Product.findOne(
                    { _id: `${item.productId}` },
                    {
                        [`versions.${item.version}.switches.${item.switch}`]: 1,
                    }
                ).lean();
                const qtyInStock =
                    product.versions[item.version].switches[item.switch]
                        .quantity;
                if (qtyInStock < updateQty) {
                    throw new Error('Error: Not enough products in stock!');
                }
                item.qty = updateQty;
                cart.totalQty += item.qty;
                cart.totalCost += item.qty * item.price;
                if (item.qty <= 0) {
                    await cart.items.remove({ _id: item._id });
                }
                count++;
            }
            if (note) {
                cart.note = note;
            }
            // if no item in cart, remove cart
            if (cart.totalQty <= 0) {
                req.session.cart = null;
                await Cart.findByIdAndRemove(cart._id);
            } else {
                req.session.cart = cart;
                //save the cart it only if user is logged in
                if (req.user) {
                    await cart.save();
                }
            }
        }
        req.flash('success', 'Success: Updated cart successfully!');
        res.redirect(req.headers.referer);
    } catch (err) {
        console.log(err.message);
        req.flash('error', err.message);
        res.redirect(req.headers.referer);
    }
}

export async function checkout(req, res, next) {
    const errorMsg = req.flash('error')[0];

    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    let defaultAddress;
    if (req.user) {
        for (const address of req.user.address) {
            if (address.default) {
                defaultAddress = address;
                break;
            }
        }
    }
    res.render('shop/checkout', {
        cart: req.session.cart,
        products: await productsFromCart(req.session.cart),
        defaultAddress,
        errorMsg,
        title: 'Checkout',
    });
}

export async function placeOrder(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    try {
        const {
            country,
            firstName,
            lastName,
            address,
            additionalInfor,
            city,
            postal,
            phone,
            note,
        } = req.body;
        let email;
        if (req.user) {
            email = req.user.email;
        } else {
            email = req.body.email;
        }
        let receiverAddress;
        const fullName = firstName + ' ' + lastName;
        if (additionalInfor && postal) {
            receiverAddress =
                postal +
                ' ' +
                country +
                ', ' +
                city +
                ', ' +
                address +
                ', ' +
                additionalInfor;
        } else if (!additionalInfor && postal) {
            receiverAddress = postal + ' ' + country + ', ';
            city + ', ' + address;
        } else if (additionalInfor && !postal) {
            receiverAddress =
                country + ', ' + city + ', ' + address + ', ' + additionalInfor;
        } else {
            receiverAddress = country + ', ' + city + ', ' + address;
        }

        let cart;
        if (req.user) {
            cart = await Cart.findById(req.session.cart._id);
        } else {
            cart = req.session.cart;
        }

        const order = new Order({
            customer: {
                user: req.user,
                name: fullName,
                address: receiverAddress,
                email: email,
                phoneNumber: phone,
            },
            cart: {
                totalQty: cart.totalQty,
                totalCost: cart.totalCost,
                items: cart.items,
            },
            note: note,
        });

        for (const item of order.cart.items) {
            const foundProduct = await Product.findOne(
                { _id: `${item.productId}` },
                {
                    [`versions.${item.version}.image`]: 1,
                }
            ).lean();
            item.image = foundProduct.versions[item.version].image;
        }


        for (const item of cart.items) {
            const product = await Product.findOne({
                _id: `${item.productId}`,
            });
            let newQuantity = product.versions
                .get(item.version)
                .switches.get(item.switch).quantity;
            newQuantity -= item.qty;
            if (newQuantity < 0) {
                throw new Error('Error: Not enough products in stock!');
            } else {
                product.versions
                    .get(item.version)
                    .switches.get(item.switch).quantity = newQuantity;
            }
            await product.save();
        }
        order.save(async (err, newOrder) => {
            if (err) {
                console.log(err);
                return res.redirect('/checkout');
            }
            await cart.save();
            await Cart.findByIdAndDelete(cart._id);
            req.session.cart = null;
        });

        // instantiate the SMTP server
        const smtpTrans = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // email options
        const mailOpts = {
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: `GearFun has received the order`,
            html: `
            <div>
            <h2 style="color: #478ba2; text-align:center;">Thank you for choosing us!</h2>
            <h5 style="color: #478ba2;">Customer's email: ${email}<h3>
            <h5 style="color: #478ba2;">Name: ${fullName}<h5>
            <h5 style="color: #478ba2;">Address: ${receiverAddress}<h5>
            <h5 style="color: #478ba2;">Note: ${note}<h5>
            <h5 style="color: #478ba2;">Total cost: $${cart.totalCost}<h5>
            </div>
            </div>
            `,
        };

        // send the email
        smtpTrans.sendMail(mailOpts, (error, response) => {
            if (error) {
                console.error(error);
            }
        });
        req.session.cart = null;
        res.redirect('/orderedSucceed');
    } catch (err) {
        console.log(err.message);
        req.flash('error', err.message);
        res.redirect('/checkout');
    }
}

export function orderedSucceed(req, res) {
    res.render('shop/orderedSucceed', {
        title: 'Ordered succeed',
    });
}

// create products array to store the info of each product in the cart
async function productsFromCart(cart) {
    let products = []; // array of objects
    for (const item of cart.items) {
        const foundProduct = await Product.findOne(
            { _id: `${item.productId}` },
            {
                name: 1,
                category: 1,
                [`versions.${item.version}.image`]: 1,
            }
        )
            .populate('category')
            .lean();
        foundProduct.image = foundProduct.versions[item.version].image;
        foundProduct.quantity = item.qty;
        foundProduct.price = item.price;
        foundProduct.idInCart = item._id;
        foundProduct.variant = item.version + '/' + item.switch;
        delete foundProduct.versions
        products.push(foundProduct);
    }
    return products;
}
