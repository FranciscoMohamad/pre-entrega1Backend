const express = require('express');
const router = express.Router();
const CartManager = require('../src/cartManager');

const cartManager = new CartManager('carts.json');

// Endpoints del CARRITO

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json(newCart);
    } catch (err) {
        console.error('Error adding cart:', err);
        res.status(500).send('Error adding cart');
    }
});

router.get('/', async (req, res) => {
    const carts = await cartManager.getCarts();
    res.json(carts);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const cart = await cartManager.getCart(id);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).send('Error fetching cart');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    try {
        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        res.json(updatedCart);
    } catch (err) {
        console.error('Error adding product to cart:', err);
        res.status(404).send('Cart not found');
    }
});

module.exports = router;
