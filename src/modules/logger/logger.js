'use strict';
const fs = require('fs');
const path = require('path');

/**
 * 
 * @param {String} text 
 * @param {Function} callback 
 */
async function writeLog(text, callback = () => null) {
    const date = new Date();
    let year = date.getFullYear().toString();
    let month = (date.getMonth() +1).toString();
    let day = date.getDate().toString();
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    let seconds = date.getSeconds().toString();

    month.length === 1 && (month = `0${month}`);
    day.length === 1 && (day = `0${day}`);
    hours.length === 1 && (hours = `0${hours}`);
    minutes.length === 1 && (minutes = `0${minutes}`);
    seconds.length === 1 && (seconds = `0${seconds}`);

    const logPath = path.join(process.env.LOGS_DIR, `log${year}${month}${day}`);
    
    fs.appendFile(logPath, `${hours}:${minutes}:${seconds}: ${text}\n`, (err) => {
        err && console.log(`Error on writing log: ${err.message}`);
        callback();
    });
}

module.exports = writeLog;