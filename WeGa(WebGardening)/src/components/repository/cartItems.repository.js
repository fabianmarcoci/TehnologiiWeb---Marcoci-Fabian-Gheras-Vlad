const db = require('../config/db');

class CartItemsRepository {
    async insertCartItem(cartId, productId, quantity) {
        const query = `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
        const values = [cartId, productId, quantity];

        try {
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async findCartItemByCartIdAndProductId(cartId, productId) {
        const query = 'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2';
        const values = [cartId, productId];

        try {
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async findCartItemsByCartId(cartId) {
        const query = 'SELECT * FROM cart_items WHERE cart_id = $1';
        const values = [cartId];

        try {
            const { rows } = await db.query(query, values);
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async updateCartItemQuantity(cartItemId, quantity) {
        const query = `UPDATE cart_items SET quantity = $1 WHERE item_id = $2 RETURNING *`;
        const values = [quantity, cartItemId];

        try {
            const { rows } = await db.query(query, values);
            console.log("Updated cart item: ", rows[0]);
            return rows[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async deleteCartItem(cartItemId) {
        const query = `DELETE FROM cart_items WHERE item_id = $1 RETURNING *`;
        const values = [cartItemId];

        try {
            const { rows } = await db.query(query, values);
            console.log("Deleted cart item: ", rows[0]);
            return rows[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async clearUserCart(cartId) {
        const query = `DELETE FROM cart_items WHERE cart_id = $1 RETURNING *`;
        const values = [cartId];
        try {
            const { rows } = await db.query(query, values);

            if(rows.length > 0) {
                console.log("Deleted cart items: ", rows);
                return rows[0];
            } else {
                console.log("No cart items to delete.");
                return null;
            }

        } catch (err) {
            console.log(err);
            throw err;
        }
    }

}

module.exports = new CartItemsRepository();
