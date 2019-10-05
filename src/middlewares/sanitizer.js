'use strict';
const regexp = /[(<>"'$+{}=`&]/ig;

/*
Full dangerous chars map

'&': '',
'<': '',
'>': '',
'"': '',
"'": '',
'$': '',
'+': '',
'{': '',
'}': '',
'`': '',
'=': '',
'\(': ''
*/

const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#96;',
    '/': '&#x2F;',
    '$': '&#36;',
};

async function sanitizer (req, res, next) {
    for(let key in req.body) {
        if(typeof req.body[key] === "string" && key !== "password"){
            req.body[key] = req.body[key].replace(regexp, (match) => (map[match])).trim();
        }
    }
    next();
}

module.exports = sanitizer;