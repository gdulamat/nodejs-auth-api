'use strict'
const nodemailer = require('nodemailer');
let transporter;
let mail;

class Mailer {
    static async configMailer() {
        transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });
        logger('Email transporter created successfully');
    }

    /**
     * 
     * @param {String} email 
     * @param {String} subject 
     * @param {String} text 
     * @param {String} html 
     */

    static async sendMail(email, subject, text, html) {
        const mailObj = {
            from: `Mailer Test <${process.env.MAIL_USER}>`,
            to: email,
            subject,
            text,
            html
        }

        try {
            await transporter.sendMail(mailObj);
            return { success: true }
        } catch(e) {
            return { error: e.message }
        }
    }

}

module.exports = Mailer;