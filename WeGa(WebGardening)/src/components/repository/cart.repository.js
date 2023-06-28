const pool = require('../config/db');

async function getCartByUserId(userId) {
    const sqlQuery = 'SELECT * FROM carts WHERE user_id = $1';
    try {
        const { rows } = await pool.query(sqlQuery, [userId]);
        return rows[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {
    getCartByUserId,
};