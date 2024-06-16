// MAIL SENDER
require('dotenv').config(); // Load environment variables from .env file
const nodemailer = require('nodemailer');
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

class MailSender {
    constructor(targetEmail,email_subject,email_html) {
        this.targetEmail = targetEmail;
        this.email_subject = email_subject;
        this.email_html = email_html;
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
            subject: this.email_subject ,
            html: this.email_html, //  to support HTML emails

            
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
