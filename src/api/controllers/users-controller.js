'use strict';
const UsersDAO = require('../../dao/users-dao');
const RegistrationsDAO = require('../../dao/registrations-dao');
const bcrypt = require('bcrypt');
const Mailer = require('../../modules/mailer/mailer');
const jwt = require('jsonwebtoken');

class UsersController {

    static async register(req, res, next) {
        const validPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        const validEmail = /\w+@\w+\.\w+/;
        const { email, password } = req.body;
        const errors = {};
        let hashedPass;
        let code;

        //validation phase
        typeof email !== "string" && (errors.email = "Incorrect type of data in the email field");
        typeof password !== "string" && (errors.password = "Incorrect type of data in the password field");
        !validEmail.test(email) && (errors.email = "Invalid email format");
        !validPassword.test(password) && (errors.password = "Password must containt at least: 1 lowercase char, 1 uppercase char, 1 number, 1 special character");
        await UsersDAO.getUser({"email": email}) !== null && (errors.email = "Email is already registered");

        //if validation fails send error obj as response
        if(Object.keys(errors).length > 0) return res.json(errors);

        hashedPass = await bcrypt.hash(password, 10);
        code = await randomBytesString(60);

        let registration = await RegistrationsDAO.createRegistration(email, hashedPass, code);
        if("error" in registration) return res.json(registration);

        let registrationStatus = await Mailer.sendMail(email, 'test', `http://localhost:${process.env.PORT}/api/v1/users/register/${code}`);

        res.json(registrationStatus);
    }

    static async confirmRegistration(req, res, next) {
        let errors = {};
        let userData;
        let createResult;
        let token;

        //validation phase
        userData = await RegistrationsDAO.getRegistration(req.params.code);
        console.log(userData)
        "error" in userData && (errors.db = "DB error");
        userData === null && (errors.code = "Invalid code");
        await UsersDAO.getUser({"email": userData.email}) !== null && (errors.email = "Email is already registered");

        //if validation fails send error obj as response
        if(Object.keys(errors).length > 0) return res.json(errors);
        //move data to the users collection and remove registration
        createResult = await UsersDAO.createUser(userData);
        if("error" in createResult) return res.send(createResult);
        await RegistrationsDAO.removeRegistration(userData.code);

        //send token to user on successful registation confirm
        token = await jwt.sign({user: userData.email}, process.env.SECRET, {expiresIn: '30d'});
        res.json({token: `Bearer ${token}`});
    }

    static async login(req, res, next) {

        try {
            const { email, password } = req.body;
            const { password: dbPassword } = await UsersDAO.getUser({"email": email});
            let token;

            if(await bcrypt.compare(password, dbPassword)) {
                //send token to user on successful login
                token = await jwt.sign({user: email}, process.env.SECRET, {expiresIn: '30d'});
                return res.json({token: `Bearer ${token}`});
            } else {
                throw new Error('Damn it feels good to be a gangsta');
            }

        } catch(e) {
            return res.json({ login: `Login error: invalid username or password` });
        }

    }
}

module.exports = UsersController;