const trefleAPI = require('../API/trefleAPI');
const products = require('../repository/products.repository')

trefleAPI.getPlants().then(async (plants) => {
    console.log(plants);
    for (const product of plants) {
        await products.insertProduct(product);
    }
}).catch(error => {
    console.error("An error occurred:", error);
});

