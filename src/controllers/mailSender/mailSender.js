// MAIL SENDER
require('dotenv').config(); // Load environment variables from .env file
const nodemailer = require('nodemailer');
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

class MailSender {
    constructor(token, targetEmail) {
        this.token = token;
        this.targetEmail = targetEmail;
    }

    createTransporter() {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL,
                pass: EMAIL_PASSWORD,
            },
        });
    }

    createMailOptions() {
        return {
            from: EMAIL,
            to: this.targetEmail,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://localhost:5050/api/v1/auth/reset-password/${this.token}`,
        };
    }

    async sendMail() {
        const transporter = this.createTransporter();
        const mailOptions = this.createMailOptions();

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return reject(error);
                }
                resolve(info);

            });
        });
    }
}

module.exports = MailSender;
