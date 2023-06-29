const pool = require('../config/db');

async function getCartByUserId(userId) {
    console.log("Entered getCartByUserId with user ID:", userId);
    const sqlQuery = 'SELECT * FROM carts WHERE user_id = $1';
    try {
        const { rows } = await pool.query(sqlQuery, [userId]);
        return rows[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function createCart(userId) {
    const query = `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`;
    const values = [userId];

    try {
        const { rows } = await db.query(query, values);
        return rows[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports = {
    getCartByUserId,
    createCart
};