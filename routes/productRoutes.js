const express = require('express');
const router = express.Router();
const ProductManager = require('../src/productManager');

const manager = new ProductManager('products.json');

// Endpoint para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        // Validar que los campos obligatorios estén presentes
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
        }

        // Crear el objeto de producto con valores por defecto
        const newProduct = {
            title,
            description,
            code,
            price: Number(price), // Asegurar que price sea un número
            status: true, // Por defecto true
            stock: Number(stock), // Asegurar que stock sea un número
            category,
            thumbnails: thumbnails || [], // Si no se provee thumbnails, inicializar como un array vacío
        };

        // Agregar el producto usando el manager
        await manager.addProduct(newProduct);

        // Confirmar que el producto se añadió correctamente
        res.status(201).send('Producto agregado correctamente');
    } catch (err) {
        console.error('Error al agregar el producto:', err);
        res.status(500).send('Error interno al agregar el producto');
    }
});

// Endpoint para obtener todos los productos
router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.json(products);
});

// Endpoint para obtener un producto por ID
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const product = await manager.getProduct(id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).send('Error fetching product');
    }
});

// Endpoint para actualizar un producto
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;

    // Validar que los campos obligatorios estén presentes
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    const updateFields = { title, description, code, price: Number(price), stock: Number(stock), category, thumbnails: thumbnails || [], status };

    try {
        const updatedProduct = await manager.updateProduct(id, updateFields);
        if (updatedProduct) {
            res.send('Product updated');
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).send('Error updating product');
    }
});

// Endpoint para eliminar un producto
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const deletedProduct = await manager.deleteProduct(id);
        if (deletedProduct) {
            res.send('Product deleted');
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('Error deleting product');
    }
});

module.exports = router;
