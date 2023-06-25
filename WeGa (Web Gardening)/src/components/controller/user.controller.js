const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const userRepository = require('../repository/user.repository');
const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const Mailer = require('../system/mail');
const mailer = new Mailer();

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

async function handleRegisterPostRequest(req, res) {
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

        const user = new User(data.email, data.name, data.age, data.gender, data.password);
        try {
            await userRepository.createUser(user);
            await mailer.sendMail({
                to: user.email,
                subject: 'Registration Successful',
                text: 'Congratulations! You have successfully registered.',
                html: '<p>Congratulations! You have successfully registered.</p>',
            });

            res.end('Registration successful.');
        } catch (err) {
            if (err.code === '23505') {
                res.end('An account with this email already exists.');
            } else {
                res.end('An unknown error occurred. Please try again later.');
            }
        }
    });
}

async function handleLoginPostRequest(req, res) {
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

        const { email, password } = data;

        const user = await userRepository.findUserByEmail(email);

        if (!user) {
            return res.end('Invalid email or password.');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.end('Invalid email or password.');
        }

        return res.end('Logged in successfully.');
    });
}

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
    fs.readFile(path.join(__dirname, '../../views/HTML/login.html'), (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading login.html');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
}

module.exports = {
    handleRegisterPostRequest,
    handleRegisterGetRequest,
    handleLoginPostRequest,
    handleLoginGetRequest
}


