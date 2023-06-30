const pool = require('../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function createUser(user) {
    const {email, name, age, gender, password} = user;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //console.log('data gets: ' + user.email);
    try {
        const result = await pool.query(
            'INSERT INTO public.users (email, full_name, age, gender, password) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [email, name, age, gender, hashedPassword]
        );

        const userId = result.rows[0].id;

        await pool.query(
            'INSERT INTO public.carts (user_id) VALUES ($1)',
            [userId]
        );

        return result;
    } catch (error) {
        console.error('An error occurred:', error);
    }
}


async function findUserByEmail(email) {
    try {
        //console.log("Entered findUserByEmail with email:", email);
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
