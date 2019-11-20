# Node.js API

Simple API based on Express and MongoDB allowing for authorization and storage/fetch user data as JSON. It's intended to serve a state for small apps.

## The API allows to interract with DB on following routes:
1. /api/v1/users (GET and POST requests)
2. /api/v1/users/register (POST request)
3. /api/v1/users/register/:code (GET request)
4. /api/v1/users/login (POST request)

### /api/v1/users (GET and POST requests)
1. GET returns JSON containing authorized user data. Bearer token authorization is required.
2. POST allows to insert/update document containing user data. Accepted format of the body is JSON which contains fields and values to insert/update (e.g. {"pet": "cat", "number": 2}). On successful update JSON {success: true} is returned. Bearer token authorization is required.

### /api/v1/users/register (POST request)
Registration of a new user. Accepted format of the body is JSON which contains email and password keys (e.g. {"email": "test@cool.com", "password": "Sup3rSecr!T"}). Password must contain at least 8 characters uppercase char, number and special char. On successful registration email with activation code will be sent to the user. On successful registration JSON {success: true} is returned.

### /api/v1/users/register/:code (GET request)
Confirm a registration for a single user. On successful registration JSON {token: "Bearer TOKEN"} is returned.

### /api/v1/users/login (POST request)
Allows to login a user. Accepted format of the body is JSON which contains email and password keys (e.g. {"email": "test@cool.com", "password": "Sup3rSecr!T"}). On successful login JSON {token: "Bearer TOKEN"} is returned.

## Project requires .env file in root directory with following variables:
1. PORT - port for server to listen
2. CONN_STRING - connection string for MongoDB
3. DB_NAME - database name
4. SECRET - secret string for crypto functions
5. LOGS_DIR - path to the directory for a log files
6. MAIL_USER - useraname for nodemailer
7. MAIL_PASS - password for nodemailer