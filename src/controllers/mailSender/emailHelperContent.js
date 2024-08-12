
const {getServerHostNameOrIp} = require('../auth/helper');


class MailSenderContent {
    constructor(token) {
        this.token = token;
    }

    getEmailResetPasswordSubjectEn() {
        return "SKILLUX - PASSWORD RESET.";
    }

    getEmailResetPasswordSubjectFr() {
        return "SKILLUX - Réinitialisation de mot de passe.";
    }

    getEmailResetPasswordHtmlEn() {
        return `
            <html>
            <head>
                <style>
                    .email-container {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        padding: 20px;
                        border-radius: 10px;
                        max-width: 600px;
                        margin: auto;
                        border: 1px solid #ddd;
                    }
                    .email-header {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .email-body {
                        font-size: 16px;
                        color: #555;
                        line-height: 1.5;
                    }
                    .email-link {
                        display: inline-block;
                        padding: 10px 20px;
                        font-size: 16px;
                        color: white !important;
                        background-color: #28a745;
                        border-radius: 5px;
                        text-decoration: none;
                        transition: background-color 0.3s ease;
                    }
                    .email-link:hover {
                        background-color: #218838;
                    }
                    .email-footer {
                        margin-top: 30px;
                        font-size: 14px;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">Reset Your Password</div>
                    <div class="email-body">
                        Click the following link to reset your password:
                        <br><br>
                        <a href="${getServerHostNameOrIp()}reset-password/${this.token}" class="email-link" style="color: white !important;">Reset Password</a>
                        <br><br>
                        This link won't be available after 5 minutes.
                    </div>
                    <div class="email-footer">
                        If you did not request a password reset, please ignore this email.
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    getEmailResetPasswordHtmlFr() {
        return `
            <html>
            <head>
                <style>
                    .email-container {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        padding: 20px;
                        border-radius: 10px;
                        max-width: 600px;
                        margin: auto;
                        border: 1px solid #ddd;
                    }
                    .email-header {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .email-body {
                        font-size: 16px;
                        color: #555;
                        line-height: 1.5;
                    }
                    .email-link {
                        display: inline-block;
                        padding: 10px 20px;
                        font-size: 16px;
                        color: white !important;
                        background-color: #28a745;
                        border-radius: 5px;
                        text-decoration: none;
                        transition: background-color 0.3s ease;
                    }
                    .email-link:hover {
                        background-color: #218838;
                    }
                    .email-footer {
                        margin-top: 30px;
                        font-size: 14px;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">Réinitialiser votre mot de passe</div>
                    <div class="email-body">
                        Cliquez sur le lien suivant pour réinitialiser votre mot de passe :
                        <br><br>
                        <a href="${getServerHostNameOrIp()}auth/reset-password/${this.token}" class="email-link" style="color: white !important;">Réinitialiser le mot de passe</a>
                        <br><br>
                        Ce lien ne sera plus disponible après 5 minutes.
                    </div>
                    <div class="email-footer">
                        Si vous n'avez pas demandé la réinitialisation du mot de passe, veuillez ignorer cet e-mail.
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    getEmailVerificationSubjectEn() {
        return "SKILLUX EMAIL VERIFICATION";
    }

    getEmailVerificationSubjectFr() {
        return "SKILLUX Vérification de l'e-mail";
    }

    getEmailVerificationHtmlEn() {
        return `
            <html>
            <head>
                <style>
                    .email-container {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        padding: 20px;
                        border-radius: 10px;
                        max-width: 600px;
                        margin: auto;
                        border: 1px solid #ddd;
                    }
                    .email-header {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .email-body {
                        font-size: 16px;
                        color: #555;
                        line-height: 1.5;
                    }
                    .email-link {
                        display: inline-block;
                        padding: 10px 20px;
                        font-size: 16px;
                        color: white !important;
                        background-color: #28a745;
                        border-radius: 5px;
                        text-decoration: none;
                        transition: background-color 0.3s ease;
                    }
                    .email-link:hover {
                        background-color: #218838;
                    }
                    .email-footer {
                        margin-top: 30px;
                        font-size: 14px;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">Verify Your Email</div>
                    <div class="email-body">
                        Click the following link to verify your email address:
                        <br><br>
                        <a href="${getServerHostNameOrIp()}auth/account-activation/${this.token}" class="email-link" style="color: white !important;">Verify Email</a>
                        <br><br>
                        This link won't be available after 10 minutes.
                    </div>
                    <div class="email-footer">
                        If you did not request email verification, please ignore this email.
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    getEmailVerificationHtmlFr() {
        return `
            <html>
            <head>
                <style>
                    .email-container {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        padding: 20px;
                        border-radius: 10px;
                        max-width: 600px;
                        margin: auto;
                        border: 1px solid #ddd;
                    }
                    .email-header {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .email-body {
                        font-size: 16px;
                        color: #555;
                        line-height: 1.5;
                    }
                    .email-link {
                        display: inline-block;
                        padding: 10px 20px;
                        font-size: 16px;
                        color: white !important;
                        background-color: #28a745;
                        border-radius: 5px;
                        text-decoration: none;
                        transition: background-color 0.3s ease;
                    }
                    .email-link:hover {
                        background-color: #218838;
                    }
                    .email-footer {
                        margin-top: 30px;
                        font-size: 14px;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">Vérifiez votre e-mail</div>
                    <div class="email-body">
                        Cliquez sur le lien suivant pour vérifier votre adresse e-mail :
                        <br><br>
                        <a href="${getServerHostNameOrIp()}auth/account-activation/${this.token}" class="email-link" style="color: white !important;">Vérifier l'e-mail</a>
                        <br><br>
                        Ce lien ne sera plus disponible après 10 minutes.
                    </div>
                    <div class="email-footer">
                        Si vous n'avez pas demandé la vérification de l'e-mail, veuillez ignorer cet e-mail.
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}

module.exports = MailSenderContent;
