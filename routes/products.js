import express from 'express';
import { search, productDetail, getProductByCategory } from '../controllers/products.js';

const router = express.Router();


router.get('/:slug/:id', productDetail);

// router.get('/:slug', getProductByCategory);

router.get('/search', search);

export default router;
