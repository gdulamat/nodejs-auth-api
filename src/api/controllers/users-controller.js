'use strict';
const UsersDAO = require('../../dao/users-dao');
const RegistrationsDAO = require('../../dao/registrations-dao');
const bcrypt = require('bcrypt');
const Mailer = require('../../modules/mailer/mailer');
const jwt = require('jsonwebtoken');

class UsersController {

    static async register(req, res, next) {

        try {
            const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
            const validEmail = /\w+@\w+\.\w+/;
            const { email, password } = req.body;

            //validation phase
            if(typeof email !== "string" || typeof password !== "string") throw new Error('Incorrect type of data, required type is string');
            if(!validEmail.test(email)) throw new Error('Invalid email format');
            if(!validPassword.test(password)) throw new Error('Password must containt at least: 1 lowercase char, 1 uppercase char, 1 number, 1 special character');
            if(await UsersDAO.getUser({"email": email}, {"email": 1})) throw new Error('Email is already registered');

            const hashedPass = await bcrypt.hash(password, 10);
            const code = await randomBytesString(60);
            
            //insert registration in db
            const registration = await RegistrationsDAO.createRegistration(email, hashedPass, code);
            if("error" in registration) throw new Error('DB error');
            //send activation code to user
            const registrationResult = await Mailer.sendMail(email, 'Potwierdzenie rejestracji', `http://localhost:${process.env.PORT}/api/v1/users/register/${code}`);
    
            return res.json(registrationResult);

        } catch(e) {
            return res.status(400).json({ error: `Error: ${e.message}` });
        }
    }

    static async confirmRegistration(req, res, next) {
        
        try {
            const registrationData = await RegistrationsDAO.getRegistration(req.params.code);
            const {email, code} = registrationData;
            let token;
            
            //validation phase
            if(!registrationData) throw new Error('Invalid code');
            if("error" in registrationData) throw new Error('DB error');
            if(await UsersDAO.getUser({"email": email}, {"email": 1})) throw new Error('Email is already registered');

            //move data to the users collection and remove registration
            const createResult = await UsersDAO.createUser(registrationData);
            if("error" in createResult) throw new Error('DB error');
            RegistrationsDAO.removeRegistration(code);

            //send token to user on successful registation confirm
            token = await jwt.sign({user: email}, process.env.SECRET, {expiresIn: '30d'});
            return res.json({token: `Bearer ${token}`});
                        
        } catch(e) {
            return res.json({ error: `Error: ${e.message}` });
        }
    }

    static async login(req, res, next) {

        try {
            const { email, password } = req.body;
            const { password: dbPassword } = await UsersDAO.getUser({"email": email}, {"password": 1});
            let token;

            if(await bcrypt.compare(password, dbPassword)) {
                //send token to user on successful login
                token = await jwt.sign({user: email}, process.env.SECRET, {expiresIn: '30d'});
                return res.json({token: `Bearer ${token}`});
            } else {
                throw new Error('Damn it feels good to be a gangsta');
            }

        } catch(e) {
            return res.status(401).json({ error: `Login error: invalid username or password` });
        }
    }

    static async getUserData(req, res, next) {
        try {
            const {user} = req;
            if(user) {
                const response = await UsersDAO.getUser({"email": user}, {"password": 0});
                return res.json(response);
            } else {
                throw new Error('Access denied');
            }
            
        } catch(e) {
            return res.status(401).json({error: `Error: ${e.message}`});
        }
    }

    static async updateUserData(req, res, next) {
        try {
            const {user} = req;
            if(user) {
                const response = await UsersDAO.updateUser(user, req.body);
                return res.json(response);
            } else {
                throw new Error('Access denied');
            }
            
        } catch(e) {
            return res.status(401).json({error: `Error: ${e.message}`});
        }
    }
}

module.exports = UsersController;