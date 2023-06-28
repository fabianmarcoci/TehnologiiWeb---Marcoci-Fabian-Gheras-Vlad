const pool = require('../config/db');

async function getItemsByCartId(cartId) {
    const sqlQuery = `
            SELECT 
                cart_items.item_id as cartItemId, 
                cart_items.product_id as productId, 
                cart_items.quantity as quantity, 
                products.name as productName, 
                products.price as productPrice
            FROM 
                cart_items 
            INNER JOIN 
                products ON cart_items.product_id = products.id 
            WHERE 
                cart_items.cart_id = $1
        `;

    try {
        const { rows } = await pool.query(sqlQuery, [cartId]);
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {
    getItemsByCartId,
};