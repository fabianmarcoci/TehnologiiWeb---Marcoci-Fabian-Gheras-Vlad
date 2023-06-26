const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

function handleRegisterGetRequest(req, res) {
    fs.readFile(path.join(__dirname, '../../views/HTML/register.html'), (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading register.html');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
}

function handleLoginGetRequest(req, res) {
    const cookies = querystring.parse(req.headers.cookie, '; ');
    if (!cookies.loggedIn) {
        fs.readFile(path.join(__dirname, '../../views/HTML/login.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading login.html');
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } else {
        res.writeHead(302, {
            'Location': '/index.html'
        });
        return res.end();
    }
}

function handleIndexGetRequest(req, res) {
    fs.readFile(path.join(__dirname, '../../views/HTML/index.html'), (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
}

function handleCropsGetRequest(req, res) {
    fs.readFile(path.join(__dirname, '../../views/HTML/crops.html'), (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading crops.html');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
}

function handleShoppingCartGetRequest(req, res) {
    fs.readFile(path.join(__dirname, '../../views/HTML/shoppingcart.html'), (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading shoppingcart.html');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
}

function handleProductsGetRequest(req, res) {
    fs.readFile(path.join(__dirname, '../../views/HTML/products.html'), (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading products.html');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
}

module.exports = {
    handleRegisterGetRequest,
    handleLoginGetRequest,
    handleIndexGetRequest,
    handleCropsGetRequest,
    handleShoppingCartGetRequest,
    handleProductsGetRequest
}