// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
import pool from '../Database/connection.js';
import errorCodes from '../constants/errorCodes.js';
import statusCodes from '../constants/statusCodes.js';
const auth = (req, res, next) => {
    try {
        if (req.body.role && req.body.role == "Admin") {
            return next();
        }
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            // If the Authorization header is missing, respond with an error
            return res.status(statusCodes[9]).json({
                success: false,
                erroCode: 9,
                message: errorCodes[9]
            });
        }

        // Extract the token from the Authorization header
        const token = authHeader.split(' ')[1];
        let verifyUser;
        try {
            verifyUser = jwt.verify(token, process.env.JWTSECRETKEY);
        } catch (error) {
            return res.status(statusCodes[10]).json({
                success: false,
                erroCode: 10,
                message: errorCodes[10]
            });
        }
        //getting all the information of user from the database
        const query = `
            select * from Users where email="${verifyUser.email}"
        `;
        pool.query(query, (err, result, fields) => {
            if (err) {
                return res.status(statusCodes[1]).json({
                    success: false,
                    errorCode: 1,
                    message: errorCodes[1],
                });
            }
            let user = result[0];
            if(user.IsVerified==0){
                return res.status(statusCodes[1]).json({
                    success: false,
                    errorCode: 1,
                    message: errorCodes[1],
                });
            }
            req.user = user;
            // console.log(user);
            req.token = token;
            next();
            return;
        });
    } catch (error) {
        console.log(error);
        return res.status(statusCodes[10]).json({
            success: false,
            statusCode: 10,
            message: statusCodes[10],
        });
    }
}

// module.exports = auth;
export default auth;