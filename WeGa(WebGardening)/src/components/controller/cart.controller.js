const cartRepository = require('../repository/cart.repository');
const cartItemRepository = require('../repository/carti_items.repository');
const userRepository = require('../repository/user.repository');
const productRepository = require('../repository/products.repository');

async function handleShoppingCartRequest(req, res, email) {
    try {
        // Fetch the user by their email
        const user = await userRepository.findUserByEmail(email);
        //console.log('###User: ', user);

        if (user) {
            // Fetch the cart by the user's ID
            const cart = await cartRepository.getCartByUserId(user.id);
            //console.log('###Cart: ', cart);

            if (!cart) {
                res.writeHead(404);
                res.end('Cart not found for user');
                return;
            }

            // Fetch the cart items by the cart's ID
            const cartItems = await cartItemRepository.getItemsByCartId(cart.cart_id);
            //console.log('###CartItems: ', cartItems);

            // Join the cart items with their associated products
            const cartItemsWithProductDetails = await Promise.all(
                cartItems.map(async (cartItem) => {
                    const product = await productRepository.findProductById(cartItem.productid);
                    return {
                        item_id: cartItem.cartitemid,
                        quantity: cartItem.quantity,
                        product_name: product.name,
                        product_image: product.image,
                        product_price: product.price
                    };
                })
            );


            // Send the cart items and product details to the client
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(cartItemsWithProductDetails));
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
