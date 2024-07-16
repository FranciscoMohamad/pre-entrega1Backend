const fs = require("fs").promises;

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.access(this.path);
        } catch (err) {
            await fs.writeFile(this.path, JSON.stringify([]));
        }
    }

    async generateUniqueId() {
        const carts = await this.getCartsFromFile();
        let id;
        do {
            id = Math.floor(Math.random() * 1000000);
        } while (carts.find(cart => cart.id === id));
        return id;
    }

    async addCart() {
        const carts = await this.getCartsFromFile();
        const newCart = {
            id: await this.generateUniqueId(),
            products: []
        };
        carts.push(newCart);
        await this.saveCartsToFile(carts);
        return newCart;
    }

    async getCarts() {
        return await this.getCartsFromFile();
    }

    async getCart(id) {
        const carts = await this.getCartsFromFile();
        return carts.find(cart => cart.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCartsFromFile();
        const cart = carts.find(cart => cart.id === cartId);
        if (cart) {
            const productIndex = cart.products.findIndex(p => p.product === productId);
            if (productIndex !== -1) {
                // Incrementar la cantidad si el producto ya está en el carrito
                cart.products[productIndex].quantity += 1;
            } else {
                // Agregar un nuevo producto al carrito
                cart.products.push({ product: productId, quantity: 1 });
            }
            await this.saveCartsToFile(carts);
            return cart;
        }
        throw new Error('Cart not found');
    }

    async getCartsFromFile() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            return JSON.parse(data);
        } catch (err) {
            console.error('Error reading or parsing carts file:', err);
            return [];
        }
    }

    async saveCartsToFile(carts) {
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }
}

module.exports = CartManager;