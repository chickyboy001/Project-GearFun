import express from 'express';
import { search, productDetail } from '../controllers/products.js';

const router = express.Router();


router.get('/:slug/:id', productDetail);

router.get('/search', search);

export default router;
