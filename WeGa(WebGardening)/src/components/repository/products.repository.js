const pool = require('../config/db');

const insertProduct = async (product) => {
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT * FROM products WHERE name = $1 AND image = $2`, [product.name, product.image]);
        if (res.rows.length === 0) {
            await client.query(`
                INSERT INTO products (name, price, image, description) VALUES ($1, $2, $3, $4)
            `, [product.name, product.price, product.image, product.description]);
        }
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
};

const getAllProducts = async () => {
    const client = await pool.connect();
    let res;
    try {
        res = await client.query(`SELECT * FROM products`);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
    return res.rows;
};

async function findProductByName(name) {
    const query = 'SELECT * FROM products WHERE name = $1';
    const values = [name];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}


module.exports = {
    insertProduct,
    getAllProducts,
    findProductByName
}