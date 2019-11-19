'use strict';
let users;

class UsersDAO {

    /**
     * 
     * @param {Object} dbConn reference to the connected DB
     */
    static async getCollections(dbConn, dbName) {
        try {
            users = await dbConn.db(dbName).collection('users');
            logger("Got users collection in user-dao");
            return;
        } catch(e) {
            logger(`Error on getting users colletion: ${e.message}`);
            return;
        }
    }

    /**
     * 
     * @param {Object} userData 
     */
    static async createUser(userData) {
        const {email, date, password} = userData;

        try {
            await users.insertOne({email, date, password});
            return {success: true};
        } catch(e) {
            logger(`Error on creating user: ${e.message}`);
            return {error: e.message};
        }
    }

    /**
     * @param {Object} query
     * @param {Object} projection
     * @returns {Object}
     */
    static async getUser(query, projection = {}) {

        try {
            const user = await users.findOne(query, {projection});
            return user;
        } catch (e) {
            logger(`Error on getting user: ${e.message}`);
            return {error: e.message};
        }
    }

    /**
     * 
     * @param {String} email 
     * @param {Object} updateData 
     */
    static async updateUser(email, updateData) {

        const filter = {"email": email};

        const update = {
            $currentDate: {
                "lastEdited.date": true
            },
            $set: {
                ...updateData,
                "lastEdited.offset": (new Date).getTimezoneOffset()
            }
        }
        
        try {
            await users.updateOne(filter, update, {upsert: true});
            logger(`Edit user data: ${email}`);
            return {success: true};
        } catch(e) {
            logger(`Error on edit user data: ${e.message}`);
            return {error: e.message}
        }
    }

    static async removeUser(email) {
        try {
            let a = await users.deleteOne({"email": email});
            logger(`User ${email} removed`);
            return {success: true};
        } catch(e) {
            logger(`Error on removing user: ${e.message}`);
            return {error: e.message}
        }
    }
}

module.exports = UsersDAO;