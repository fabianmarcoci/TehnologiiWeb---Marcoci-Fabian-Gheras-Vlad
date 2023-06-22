const User = require('../model/user.model');
const userRepository = require('../repository/user.repository');

module.exports = {
    register: async function(data, res) {
        const user = new User(data.email, data.name, data.age, data.gender, data.password);
        try {
            await userRepository.createUser(user);
            res.end('Registration successful.');
        } catch (err) {
            if (err.code === '23505') {
                res.end('An account with this email already exists.');
            } else {
                res.end('An unknown error occurred. Please try again later.');
            }
        }
    }
}