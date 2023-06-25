const http = require('http');
const userController = require('../controller/user.controller');
const htmlController = require('../controller/html.controller');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(req.url);
    if (req.method === 'GET') {
        if (req.url === '/register') {
            htmlController.handleRegisterGetRequest(req, res);
        } else if (req.url === '/login') {
            htmlController.handleLoginGetRequest(req, res);
        } else {
            fs.readFile(path.join(__dirname, '../views/HTML', req.url), (err, data) => {
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
        if (req.url === '/register') {
            userController.handleRegisterPostRequest(req, res);
        } else if (req.url === '/login') {
            userController.handleLoginPostRequest(req, res);
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
