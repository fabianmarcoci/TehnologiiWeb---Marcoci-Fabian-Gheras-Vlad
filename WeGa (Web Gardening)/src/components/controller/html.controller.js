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


module.exports = {
    handleRegisterGetRequest,
    handleLoginGetRequest
}