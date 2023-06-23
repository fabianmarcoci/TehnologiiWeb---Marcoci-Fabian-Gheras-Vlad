const http = require('http');
const userController = require('../controller/user.controller');

const server = http.createServer((req, res) => {
    console.log(req.url);
    if (req.url === '/register') {
        if (req.method === 'POST') {
            userController.handleRegisterPostRequest(req, res);
        } else if (req.method === 'GET') {
            userController.handleRegisterGetRequest(req, res);
        } else {
            res.end('Invalid request method.');
        }
    } else if (req.url === '/login') {
        if (req.method === 'POST') {
            userController.handleLoginPostRequest(req, res);
        } else if (req.method === 'GET') {
            userController.handleLoginGetRequest(req, res);
        } else {
            res.end('Invalid request method.');
        }
    } else {
        res.end('Invalid request URL.');
    }
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
