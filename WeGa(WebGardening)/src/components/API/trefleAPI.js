const fetch = require('node-fetch');
const https = require('https');
const Products = require('../model/products.model');
require('dotenv').config({ path: '../../../../.env' });

const agent = new https.Agent({
    rejectUnauthorized: false
});

async function getPlants() {
    const pageSize = 20;
    const pages = 25;
    const plants = [];

    for (let i = 1; i <= pages; i++) {
        const response = await fetch(`https://trefle.io/api/v1/plants?token=${process.env.TREFLE_TOKEN}&page_size=${pageSize}&page=${i}`, { agent });

        if (!response.ok) {
            throw new Error(`HTTP Error! status: ${response.status}`);
        }

        const data = await response.json();

        const newPlants = data.data.map(plant => new Products(
            plant.common_name,
            plant.image_url,
            plant.family_common_name
        ));

        plants.push(...newPlants);
    }

    return plants;
}


module.exports = {
    getPlants,
};
