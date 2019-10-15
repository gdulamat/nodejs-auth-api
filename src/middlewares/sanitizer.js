//'use strict';
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

async function sanitize(obj) {
    for(let key in obj) {
        if(typeof obj[key] === 'string' && key !== "password") {
            obj[key] = obj[key].replace(regexp, (match) => (map[match])).trim();
        }
        typeof obj[key] === 'object' && sanitize(obj[key]);
    }
}

async function sanitizer (req, res, next) {
    sanitize(req.body);
    next();
}

module.exports = sanitizer;