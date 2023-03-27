import express from 'express';
import {
    getHomePage,
    checkout,
    addToCart,
    shoppingCart,
    updateCart,
    placeOrder,
    orderedSucceed,
    buyNow,
} from '../controllers/shop.js';

const router = express.Router();

router.get('/', getHomePage);

router.post('/updateCart', updateCart);

router.get('/cart', shoppingCart);

router.post('/addToCart', addToCart);

router.post('/buyNow', buyNow);

router.get('/checkout', checkout);

router.post('/checkout', placeOrder);

router.get('/orderedSucceed', orderedSucceed);

export default router;
