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
        } catch(e) {
            logger(`Error on getting users colletion: ${e.message}`);
        }
    }

    static async createUser({email, date, password}) {
        let result;

        try {
            result = await users.insertOne({email, date, password});
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
        let user;

        try {
            user = await users.findOne(query);
            return user;
        } catch (e) {
            logger(`Error on getting user: ${e.message}`);
            return {error: e.message};
        }
    }
}

module.exports = UsersDAO;