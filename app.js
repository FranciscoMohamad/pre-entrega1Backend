const express = require("express");
const app = express();
const PORT = 8081;
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Middleware para parsear JSON
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});