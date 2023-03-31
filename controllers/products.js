import Product from '../models/product.js';
import Category from '../models/category.js';

export async function productDetail(req, res) {
    const successMsg = req.flash('success')[0];
    const errorMsg = req.flash('error')[0];
    try {
        const product = await Product.findById(req.params.id)
            .populate('category')
            .lean();
        console.log(product.category._id)
        const moreProduct = await Product.find({
            category: '6415a135877f72a6bee77c2a',
        })
            .populate('category')
            .limit(3)
            .exec();
        let getImage = [];
        for (const version of Object.values(product.versions)) {
            getImage.push(version.image);
        }
        const image = [...getImage, ...product.additional_images];
        res.render('shop/products', {
            title: product.name,
            product,
            moreProduct,
            image,
            successMsg,
            errorMsg,
        });
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

export async function search(req, res) {
    const perPage = 9;
    let page = parseInt(req.query.page) || 1;

    try {
        const products = await Product.find({
            name: { $regex: req.query.search, $options: 'i' },
        })
            // .sort('-createdAt')
            .skip(perPage * page - perPage)
            .limit(perPage)
            .populate('category')
            .exec();
        const count = await Product.count({
            name: { $regex: req.query.search, $options: 'i' },
        });
        let originalArray = [];
        for (const product of products) {
            const category = {
                title: product.category.title,
                slug: product.category.slug
            };
            originalArray.push(category);
        };
        let category = [];
        for (let i = 0; i < originalArray.length; i++) {
            let hasDuplicate = false;

            if (!originalArray[i].title) {
                category.push(originalArray[i]);
                continue;
            }

            // Check if the title field has already been encountered
            for (let j = 0; j < category.length; j++) {
                if (originalArray[i].title === category[j].title) {
                    hasDuplicate = true;
                    break;
                }
            }

            // If the title field hasn't been encountered before,
            // add the current object to the new array
            if (!hasDuplicate) {
                category.push(originalArray[i]);
            }
        }


        const priceArr = [];
        for (const product of products) {
            const [firstKey] = product.versions.keys();
            priceArr.push(product.versions.get(firstKey).price);
        };
        res.render('shop/listProduct', {
            title: req.query.search +' - '+ 'Search Results',
            category,
            products,
            priceArr,
            current: page,
            home: '/products/search?search=' + req.query.search + '&',
            pages: Math.ceil(count / perPage),
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

export async function getProductByCategory(req, res) {
    const perPage = 9;
    let page = parseInt(req.query.page) || 1;
    try {
        console.log(req.query.slug)
        const foundCategory = await Category.findOne({ slug: req.params.slug });
        const products = await Product.find({ category: foundCategory.id })
            .skip(perPage * page - perPage)
            .limit(perPage)
            .populate('category');

        const count = await Product.count({ category: foundCategory.id });

        let originalArray = [];
        for (const product of products) {
            const category = {
                title: product.category.title,
                slug: product.category.slug,
            };
            originalArray.push(category);
        }
        let category = [];
        for (let i = 0; i < originalArray.length; i++) {
            let hasDuplicate = false;

            if (!originalArray[i].title) {
                category.push(originalArray[i]);
                continue;
            }

            // Check if the title field has already been encountered
            for (let j = 0; j < category.length; j++) {
                if (originalArray[i].title === category[j].title) {
                    hasDuplicate = true;
                    break;
                }
            }

            // If the title field hasn't been encountered before,
            // add the current object to the new array
            if (!hasDuplicate) {
                category.push(originalArray[i]);
            }
        }
        
        const priceArr = [];
        for (const product of products) {
            const [firstKey] = product.versions.keys();
            priceArr.push(product.versions.get(firstKey).price);
        }
        res.render('shop/listProduct', {
            title: `Keyboard layout ${foundCategory.title}`,
            products,
            category,
            priceArr,
            current: page,
            home: '/products/search?search=' + req.query.search + '&',
            pages: Math.ceil(count / perPage),
        });
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}
