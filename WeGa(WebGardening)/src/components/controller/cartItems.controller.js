const CartItemsRepository = require('../repository/cartItems.repository');
const UserRepository = require('../repository/user.repository');
const CartRepository = require('../repository/cart.repository');
const ProductRepository = require('../repository/products.repository');

async function insertCartItemsPostRequest(req, res) {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });

    req.on('end', async () => {
        /** @type {{email: string, item: {title: string, price: number, img: string, count: number}}} */
        const { email, item } = JSON.parse(data);
        console.log('Received data:', { email, item });

        try {
            // Find user by email
            const user = await UserRepository.findUserByEmail(email);
            console.log('Found user:', user);

            // If user not found, respond with an error
            if (!user) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
                return;
            }

            // Find cart by user id
            let cart = await CartRepository.getCartByUserId(user.id);
            console.log('Found cart:', cart);

            // If cart not found, create one
            if (!cart) {
                cart = await CartRepository.createCart(user.id);
            }

            // Find product by name
            const product = await ProductRepository.findProductByName(item.title);
            console.log('Found product:', product);

            // If product not found, respond with an error
            if (!product) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Product not found' }));
                return;
            }

            // Find cart item by cart id and product id
            let cartItem = await CartItemsRepository.findCartItemByCartIdAndProductId(cart.id, product.id);

            // If cart item not found, insert one. Otherwise, update the quantity.
            if (cartItem) {
                const newQuantity = cartItem.quantity + item.count;
                cartItem = await CartItemsRepository.updateCartItemQuantity(cartItem.id, newQuantity);
            } else {
                cartItem = await CartItemsRepository.insertCartItem(cart.cart_id, product.product_id, item.count);
            }

            console.log('Final cart item:', cartItem);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(cartItem));
        } catch (error) {
            console.error('An error occurred:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'An error occurred' }));
        }
    });
}


async function deleteCartItem(req, res) {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });

    req.on('end', async () => {
        const { cartItemId } = JSON.parse(data);

        try {
            const deletedItem = await CartItemsRepository.deleteCartItem(cartItemId);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deletedItem));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'An error occurred' }));
        }
    });
}


module.exports = { insertCartItemsPostRequest, deleteCartItem };
