'use strict';
const crypto = require('crypto');
const logger = require('../logger/logger');

/**
 * 
 * @param {Object} dateObj 
 * @param {Integer} offset 
 * @returns {Object}
 */
async function fixTimezone(dateObj, offset) {
    return new Date(dateObj.getTime() - (offset * 60000));
}
global.fixTimezone = fixTimezone;

/**
 * 
 * @param {Number} length 
 */
async function randomBytesString(length = 10) {
    return crypto.randomBytes(Math.ceil(length /2)).toString('hex').slice(0, length);
}
global.randomBytesString = randomBytesString;

/**
 * 
 * @param {Number} length 
 */
async function randomPassword(length = 10) {
    return crypto
    .randomBytes(Math.ceil((length * 3) / 4))
    .toString('base64')
    .slice(0, length)
    .replace(/\+/g, '0')
    .replace(/\//g, '0')
}
global.randomPassword = randomPassword;

global.logger = logger;

logger('Global extensions loaded successfully');