'use strict';
let users;

class UsersDAO {

    /**
     * 
     * @param {Object} dbConn reference to the connected DB
     */
    static async getCollections(dbConn) {
        try {
            users = await dbConn.db(process.env.DB_NAME).collection('users');
            logger("Got users collection in user-dao");
            return;
        } catch(e) {
            logger(`Error on getting users colletion: ${e.message}`);
            return;
        }
    }

    static async createUser({email, date, password}) {

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
     * @returns {Object}
     */
    static async getUser(query) {

        try {
            const user = await users.findOne(query);
            return user;
        } catch (e) {
            logger(`Error on getting user: ${e.message}`);
            return {error: e.message};
        }
    }
}

module.exports = UsersDAO;