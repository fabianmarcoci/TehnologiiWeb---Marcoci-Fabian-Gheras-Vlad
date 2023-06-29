const http = require('http');
const userController = require('../controller/user.controller');
const htmlController = require('../controller/html.controller');
const fs = require('fs');
const path = require('path');
const url = require('url');
const root = path.resolve(__dirname, '../../../');
const cartController = require('../controller/cart.controller');
const cartItemsController = require('../controller/cartItems.controller');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = decodeURIComponent(parsedUrl.pathname);
    if (pathname === '/') {
        pathname = '/index.html';
    }
    //console.log(pathname);
    if (req.method === 'GET') {
        if (pathname.endsWith('/register.html')) {
            htmlController.handleRegisterGetRequest(req, res);
        } else if (pathname.endsWith('/login.html')) {
            htmlController.handleLoginGetRequest(req, res);
        } else if (pathname.endsWith('/index.html')) {
            htmlController.handleIndexGetRequest(req, res);
        } else if (pathname.endsWith('/shoppingcart.html')) {
            htmlController.handleShoppingCartGetRequest(req, res);
        } else if (pathname.endsWith('/products.html')) {
            htmlController.handleProductsGetRequest(req, res);
        } else if (pathname.endsWith('/crops.html')) {
            htmlController.handleCropsGetRequest(req, res);
        } else if (pathname.endsWith('/crop.html')) {
            htmlController.handleCropGetRequest(req, res);
        } else if (pathname.endsWith('/userview.html')) {
            htmlController.handleUserViewGetRequest(req, res);
        } else if (pathname.startsWith('/api/cart')) {
            const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
            const email = parsedUrl.searchParams.get('email');
            console.log("Received request for /api/cart with email:", email);
            cartController.handleShoppingCartRequest(req, res, email);
        } else if (pathname.endsWith('.json')) {
            let relativePath = pathname.slice('/TehnologiiWeb---Marcoci-Fabian-Gheras-Vlad/WeGa(WebGardening)/'.length);
            let fullPath = path.join(root, relativePath);
            fs.readFile(fullPath, (err, data) => {
                if (err) {
                    console.log('Error reading JSON file:', err);
                    res.writeHead(500);
                    res.end('500 Internal Server Error');
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(data);
                }
            });
        } else if (pathname.endsWith('.css')) {
            let relativePath = pathname.slice('/TehnologiiWeb---Marcoci-Fabian-Gheras-Vlad/WeGa(WebGardening)/'.length);
            let fullPath = path.join(root, relativePath);
            //console.log('Relative path:', relativePath);
            //console.log('Full path:', fullPath);
            fs.readFile(fullPath, (err, data) => {
                if (err) {
                    console.log('Error reading CSS file:', err);
                    res.writeHead(500);
                    res.end('500 Internal Server Error');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/css'});
                    res.end(data);
                }
            });
        } else if (pathname.endsWith('.png') || pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
                let relativePath = pathname.slice('/TehnologiiWeb---Marcoci-Fabian-Gheras-Vlad/WeGa(WebGardening)/'.length);
                let fullPath = path.join(root, relativePath);
                //console.log('Relative path:', relativePath);
                //console.log('Full path:', fullPath);
                fs.readFile(fullPath, (err, data) => {
                    if (err) {
                        console.log('Error reading image file:', err);
                        res.writeHead(500);
                        res.end('500 Internal Server Error');
                    } else {
                        let contentType = 'image/png';
                        if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
                            contentType = 'image/jpeg';
                        }
                        res.writeHead(200, {'Content-Type': contentType});
                        res.end(data);
                    }
                });
        } else {
            fs.readFile(path.join(__dirname, '../../views/HTML', pathname), (err, data) => {
                if (err) {
                    fs.readFile(path.join(__dirname, '../views/HTML/error404.html'), (err, data) => {
                        if (err) {
                            res.writeHead(500);
                            res.end('500 Internal Server Error');
                        } else {
                            res.writeHead(404);
                            res.end(data);
                        }
                    });
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data);
                }
            });
        }
    } else if (req.method === 'POST') {
        if (pathname === '/register') {
            userController.handleRegisterPostRequest(req, res);
        } else if (pathname === '/login') {
            userController.handleLoginPostRequest(req, res);
        } else if (pathname.startsWith('/api/cart')) {
            cartItemsController.insertCartItemsPostRequest(req, res);
        } else {
            res.end('Invalid request URL.');
        }
    } else {
        res.end('Invalid request method.');
    }
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
