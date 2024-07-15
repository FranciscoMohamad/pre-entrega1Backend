const fs = require("fs").promises;

class ProductManager {

    constructor(filePath) {
        this.path = filePath;
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.access(this.path); // Verifica si el archivo existe
        } catch (err) {
            // Si no existe, inicializa con un array vacío
            await fs.writeFile(this.path, JSON.stringify([]));
        }
    }

    async getNextId() {
        const products = await this.getProductsFromFile();
        return products.length + 1; // Calcula el próximo ID basado en la cantidad actual de productos
    }

    async addProduct(product) {
        const products = await this.getProductsFromFile();
        const nextId = await this.getNextId();
    
        // Asignar el próximo ID al producto
        product.id = nextId;
    
        // Agregar el producto al array de productos
        products.push(product);
    
        // Guardar los productos actualizados en el archivo
        await this.saveProductsToFile(products);
    }

    async getProducts() {
        return await this.getProductsFromFile(); // Obtiene y devuelve todos los productos
    }

    async getProduct(id) {
        const products = await this.getProductsFromFile();
        return products.find(product => product.id === id); // Busca y devuelve el producto por ID
    }

    async updateProduct(id, updateFields) {
        let products = await this.getProductsFromFile();
        const index = products.findIndex(product => product.id === id); // Encuentra el índice del producto por ID

        if (index !== -1) {
            products[index] = { ...products[index], ...updateFields }; // Actualiza los campos del producto
            await this.saveProductsToFile(products); // Guarda los productos actualizados en el archivo
        }
    }

    async deleteProduct(id) {
        let products = await this.getProductsFromFile();
        products = products.filter(product => product.id !== id); // Filtra los productos para eliminar el producto por ID
        await this.saveProductsToFile(products); // Guarda los productos actualizados en el archivo
    }

    async getProductsFromFile() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            return JSON.parse(data); // Parsea los datos del archivo JSON y los devuelve como objeto JavaScript
        } catch (err) {
            console.error('Error reading or parsing products file:', err);
            return []; // Devuelve un array vacío si hay errores
        }
    }

    async saveProductsToFile(products) {
        await fs.writeFile(this.path, JSON.stringify(products, null, 2)); // Guarda los productos en el archivo
    }
}

module.exports = ProductManager;
