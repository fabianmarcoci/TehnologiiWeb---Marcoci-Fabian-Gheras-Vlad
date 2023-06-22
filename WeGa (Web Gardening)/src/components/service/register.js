const http = require('http');
const querystring = require('querystring');
const userController = require('../controller/user.controller');
const fs = require('fs');
const path = require('path');

function validateData(data) {
    if (!data.email.includes('@')) {
        return 'Invalid email address.';
    }

    if (!data.name) {
        return 'Full name is required.';
    }

    if (!Number.isInteger(Number(data.age)) || Number(data.age) <= 0) {
        return 'Invalid age. Must be a positive integer.';
    }

    if (!['Male', 'Female', 'Other'].includes(data.gender)) {
        return 'Invalid gender. Must be Male, Female, or Other.';
    }

    if (data.password.length < 5 || data.password.length > 20) {
        return 'Password must be between 5 and 20 characters long.';
    }

    return null;
}

const server = http.createServer((req, res) => {
    if (req.url === '/register') {
        if (req.method === 'GET') {
            fs.readFile(path.join(__dirname, '../../views/HTML/Register.html'), (err, data) => {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading Register.html');
                }

                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            });
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                let data;
                const contentType = req.headers['content-type'];
                if (contentType === 'application/x-www-form-urlencoded') {
                    data = querystring.parse(body);
                } else {
                    res.writeHead(400);
                    res.end('Bad Request: expecting application/x-www-form-urlencoded content-type');
                    return;
                }

                const validationError = validateData(data);

                if (validationError) {
                    res.end(validationError);
                    return;
                }

                await userController.register(data, res);
            });
        } else {
            res.end('Invalid request method.');
        }
    } else {
        res.end('Invalid request URL.');
    }
});

const port = 63342;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
