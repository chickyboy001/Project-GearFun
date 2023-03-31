import mongoose from 'mongoose';
import Category from '../models/category.js';
import Product from '../models/product.js';
import fileUploader from '../configs/cloudinary.config.js';

const formatPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export function updateProduct(req, res) {
    try {
        res.render('admin/updateProduct', {
            layout: false,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function updateDescription(req, res) {
    try {
        console.log(req.body.content);
        const description = req.body.content;
        console.log(description);
        const product = await Product.findById('64181a5c00e19efe8c385dbc');
        product.description = description;
        const updatedProduct = await product.save();

        return res.status(201).json({
            success: true,
            message: 'New category created successfully',
            Product: updatedProduct,
        });

    } catch (error) {
        console.log(error);
    }
}

export async function createCategory(req, res) {
    try {
        const category = new Category({
            title: req.body.title,
        });

        const newCategory = await category.save();

        return res.status(201).json({
            success: true,
            message: 'New category created successfully',
            Category: newCategory,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
}

export async function createProduct(req, res) {
    try {
        const {
            name,
            manufacturer,
            version_name,
            switch_name,
            quantity,
            image,
            price,
            description,
            category,
        } = req.body;
        const product = new Product({
            name,
            manufacturer,
            versions: new Map([
                [
                    version_name,
                    {
                        switches: new Map([[switch_name, { quantity}]]),
                        image,
                        price,
                    },
                ],
            ]),
            description,
            category,
        });

        const newProduct = await product.save();

        return res.status(201).json({
            success: true,
            message: 'New product created successfully',
            Product: newProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
}

export async function testForm(req, res) {
    try {
        const {
            name,
            manufacturer,
            version_name,
            switch_name,
            quantity,
            image,
            price,
            description,
            category,
        } = req.body;
        const product = new Product({
            name,
            manufacturer,
            versions: new Map([
                [
                    version_name,
                    {
                        switches: new Map([[switch_name, { quantity }]]),
                        image,
                        price,
                    },
                ],
            ]),
            description,
            category,
        });

        const newProduct = await product.save();

        return res.status(201).json({
            success: true,
            message: 'New product created successfully',
            Product: newProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
}
