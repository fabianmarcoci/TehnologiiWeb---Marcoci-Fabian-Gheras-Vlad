const pool = require('../config/db');
const bcrypt = require('bcrypt');
const {compareSync} = require("bcrypt");
const saltRounds = 10;

module.exports = {
    createUser: async function(user) {
        const { email, name, age, gender, password } = user;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const res = await pool.query(
            'INSERT INTO public.users (email, full_name, age, gender, password) VALUES ($1, $2, $3, $4, $5)',
            [email, name, age, gender, hashedPassword]
        );
        return res;
    }
}
