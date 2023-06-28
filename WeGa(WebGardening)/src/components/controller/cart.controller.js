const cartRepository = require('../repository/cart.repository');
const cartItemRepository = require('../repository/carti_items.repository');
const userRepository = require('../repository/user.repository');

async function handleShoppingCartRequest(req, res, email) {
    try {
        const user = await userRepository.findUserByEmail(email);
        if (user) {
            const cart = await cartRepository.getCartByUserId(user.id);
            const cartItems = await cartItemRepository.getItemsByCartId(cart.id);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(cartItems));
        } else {
            res.writeHead(404);
            res.end('User not found');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.writeHead(500);
        res.end('Server error');
    }
}

module.exports = {
    handleShoppingCartRequest,
};