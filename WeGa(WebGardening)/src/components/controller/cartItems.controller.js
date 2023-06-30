const CartItemsRepository = require('../repository/cartItems.repository');
const UserRepository = require('../repository/user.repository');
const CartRepository = require('../repository/cart.repository');
const ProductRepository = require('../repository/products.repository');
const Mailer = require('../system/mail');

async function insertCartItemsPostRequest(req, res) {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });

    req.on('end', async () => {
        /** @type {{email: string, item: {title: string, price: number, img: string, count: number}}} */
        const { email, item } = JSON.parse(data);
        //console.log('Received data:', { email, item });

        try {
            // Find user by email
            const user = await UserRepository.findUserByEmail(email);
            //console.log('Found user:', user);

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
            //console.log('Found product:', product);

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

            //console.log('Final cart item:', cartItem);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(cartItem));
        } catch (error) {
            console.error('An error occurred:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'An error occurred' }));
        }
    });
}

async function handleUpdateCartItemsRequest(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { cartItemId, quantity } = JSON.parse(body);

        if (typeof quantity !== 'number' || quantity <= 0) {
            res.writeHead(400);
            res.end('Invalid quantity');
            return;
        }

        try {
            await CartItemsRepository.updateCartItemQuantity(cartItemId, quantity);
            res.writeHead(204);
            res.end();
        } catch (error) {
            console.error('An error occurred:', error);
            res.writeHead(500);
            res.end('Server error');
        }
    });
}


async function handleDeleteCartItemsRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const cartItemId = Number(url.pathname.split('/').pop());

    if (isNaN(cartItemId)) {
        res.writeHead(400);
        res.end('Invalid cart item ID');
        return;
    }

    try {
        await CartItemsRepository.deleteCartItem(cartItemId);
        res.writeHead(204);
        res.end();
    } catch (error) {
        console.error('An error occurred:', error);
        res.writeHead(500);
        res.end('Server error');
    }
}

async function handlePlaceOrderRequest(req, res) {
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    });

    req.on('end', async () => {
        /** @type {{email: string}} */
        const { email } = JSON.parse(data);

        try {
            const user = await UserRepository.findUserByEmail(email);

            if (!user) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
                return;
            }

            let cart = await CartRepository.getCartByUserId(user.id);

            if (!cart) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Cart not found' }));
                return;
            }

            let cartItems = await CartItemsRepository.findCartItemsByCartId(cart.cart_id);

            let emailContentPromises = cartItems.map(async item => {
                const product = await ProductRepository.findProductById(item.product_id);
                return `${product.name}: ${product.price} (${item.quantity}x)`;
            });

            let emailContent = (await Promise.all(emailContentPromises)).join(', ');

            const mailer = new Mailer();
            const mailOptions = {
                to: email,
                subject: 'Your order has been placed',
                text: `Dear user, your order has been successfully placed. Here are your order details: ${emailContent}`,
                html: `<p>Dear user, your order has been successfully placed. Here are your order details: ${emailContent}</p>`
            };
            await mailer.sendMail(mailOptions);

            await CartItemsRepository.clearUserCart(cart.cart_id);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Order placed successfully' }));
        } catch (error) {
            console.error('An error occurred:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'An error occurred while placing the order' }));
        }
    });
}


module.exports = {
    insertCartItemsPostRequest,
    handleDeleteCartItemsRequest,
    handleUpdateCartItemsRequest,
    handlePlaceOrderRequest
};
