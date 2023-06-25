require('dotenv').config({ path: '../../../../.env' });
const nodemailer = require('nodemailer');

class Mailer {
    constructor(service = 'hotmail') {
        this.transporter = nodemailer.createTransport({
            service: service,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendMail(options) {
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        try {
            let info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
        } catch(error) {
            console.error('An error occurred: ', error);
        }
    }
}

module.exports = Mailer;
