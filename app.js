const express = require("express");
const app = express();
const PORT = 8080;
const ProductManager = require("./productManager");

// Middleware para parsear JSON
app.use(express.json());

const manager = new ProductManager('products.json');

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});

// Endpoints de Express

// Endpoint para agregar un nuevo producto
app.post('/products', async (req, res) => {
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

app.get('/products', async (req, res) => {
    const products = await manager.getProducts();
    res.json(products);
});

app.get('/products/:id', async (req, res) => {
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

app.post('/products', async (req, res) => {
    try {
        const newProduct = req.body;
        await manager.addProduct(newProduct);
        res.status(201).send('Product added');
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).send('Error adding product');
    }
});

app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updateFields = req.body;
    manager.updateProduct(id, updateFields);
    res.send('Product updated');
});

app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    manager.deleteProduct(id);
    res.send('Product deleted');
});

// Otros endpoints (get por ID, put, delete) aquí...

// Ejemplos de operaciones de manejo de productos (puedes mover estos a un script separado si prefieres)
(async () => {
    try {
        await manager.addProduct({
            title: "producto A",
            description: "descripcion del producto A",
            price: 1000,
            code: "ABC123",
            stock: 10
        });

        await manager.addProduct({
            title: "producto B",
            description: "descripcion del producto B",
            price: 1700,
            code: "ACC123",
            stock: 10
        });
        await manager.addProduct({
            title: "producto C",
            description: "descripcion del producto C",
            price: 100,
            code: "ACC123",
            stock: 10
        });
        await manager.addProduct({
            title: "producto D",
            description: "descripcion del producto D",
            price: 1300,
            code: "ACC123",
            stock: 10
        });

        // Otros productos aquí...

        // Console.log de todos los productos (opcional)
        const allProducts = await manager.getProducts();
        console.log(allProducts);
    } catch (err) {
        console.error('Error executing initial operations:', err);
    }
})();

// Comando para eliminar productos:
// manager.deleteProduct(3)

// Comando para actualizar productos:
// manager.updateProduct(1, { price: 9000, stock: 1 });