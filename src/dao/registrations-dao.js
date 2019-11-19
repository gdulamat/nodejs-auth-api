'use strict';

let registrations;

class RegistrationsDAO {

    /**
     * 
     * @param {Object} dbConn 
     */
    static async getCollections(dbConn, dbName) {
        try {
            registrations = await dbConn.db(dbName).collection('registrations');
            logger("Got registrations collection in registrations-dao");
        } catch(e) {
            logger(`Error on getting users colletion: ${e.message}`);
        }
    }

    /**
     * 
     * @param {string} email 
     * @param {string} password 
     * @param {string} code
     * @returns {Object}
     */
    static async createRegistration(email, password, code) {
        const filter = {"email": email};
        const update = {
            $currentDate: {
                "date.registrationTime": true
            },
            $set: {
                "email": email,
                "password": password,
                "code": code,
                "date.offset": (new Date).getTimezoneOffset()
            }
        }
        
        try {
            await registrations.updateOne(filter, update, {upsert: true});
            logger(`New registration: ${email}`);
            return {success: true};
        } catch(e) {
            logger(`Error on registration: ${e.message}`);
            return {error: e.message}
        }
    }

    /**
     * 
     * @param {String} code 
     */
    static async getRegistration(code) {
        try {
            const registrationData = await registrations.findOne({"code": code}, {projection: {_id: 0}});
            return registrationData;
        } catch(e) {
            return {error: e.message};
        }
    }

    /**
     * 
     * @param {Object} filter 
     */
    static async removeRegistration(code) {
        try {
            await registrations.deleteOne({"code": code});
            logger(`Registration removed`);
            return {success: true};
        } catch(e) {
            logger(`Error on removing registration: ${e.message}`);
            return {error: e.message}
        }
    }

    static async removeOutdatedRegistrations() {
        try {
            await registrations.deleteMany({"date.registrationTime": {$lt: new Date(Date.now() - 3 * 60 * 60 * 1000)}});
            logger(`Outdated removed`);
            return {success: true};
        } catch(e) {
            logger(`Error on removing registrations: ${e.message}`);
            return {error: e.message}
        }
    }
}

module.exports = RegistrationsDAO;