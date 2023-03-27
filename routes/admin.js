import express from 'express';
import {
    createCategory,
    updateProduct,
    updateDescription,
} from '../controllers/admin.js';

const router = express.Router();

router.post('/createCategory', createCategory);
router.post('/updateProduct', updateDescription);
router.get('/updateProduct', updateProduct);

export default router;
