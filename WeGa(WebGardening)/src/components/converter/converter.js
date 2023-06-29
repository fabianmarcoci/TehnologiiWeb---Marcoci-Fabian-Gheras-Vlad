const fs = require('fs');
const productsRepository = require('../repository/products.repository');

async function saveProductsToFile() {
    const products = await productsRepository.getAllProducts();
    fs.writeFileSync('../JSON/products.json', JSON.stringify(products));
}

saveProductsToFile();
