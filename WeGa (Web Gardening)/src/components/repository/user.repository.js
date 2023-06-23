const pool = require('../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function createUser(user) {
    const {email, name, age, gender, password} = user;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('data gets: ' + user.email);
    try {
        return await pool.query(
            'INSERT INTO public.users (email, full_name, age, gender, password) VALUES ($1, $2, $3, $4, $5)',
            [email, name, age, gender, hashedPassword]
        );
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function findUserByEmail(email) {
    try {
        const res = await pool.query(
            'SELECT * FROM public.users WHERE email = $1',
            [email]
        );
        return res.rows[0];
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

module.exports = {
    createUser,
    findUserByEmail
}
