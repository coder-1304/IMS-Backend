import print from '../../constants/print.js';
import '../../services/customErrorHandler.js'
import CustomErrorHandler from '../../services/customErrorHandler.js';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
// const { createPool } = require('mysql2');
import pool from '../../Database/connection.js';
import jwt from 'jsonwebtoken';
import mailController from './otpVerification.js';
import validator from 'validator';
import errorCodes from '../../constants/errorCodes.js';
import statusCodes from '../../constants/statusCodes.js';


function validate(email, password, repeatPassword, fullName) {
    let validationErrors = [];
    if (password !== repeatPassword) {
        validationErrors.push("Passwords don't match");
    }

    if (!validator.isEmail(email)) {
        validationErrors.push("Invalid Email Address");
    }

    if (fullName.length < 3 || fullName.length > 100) {
        validationErrors.push("Full Name is not valid");
    }

    return validationErrors;
}


const registerController = {

    async register(req, res, next) {
        try {
            const fullName = req.body.fullName;
            const email = req.body.email;
            const phone = req.body.phone;
            let password = req.body.password;
            const repeatPassword = req.body.repeatPassword;
            const role = req.body.role;
            // 1) Checking for null fields
            if (!fullName || !email || !phone || !password || !repeatPassword || !role) {
                return res.status(statusCodes[2]).json({
                    success: false,
                    errorCode: 2,
                    message: errorCodes[2]
                })
            }

            let adminEmail;

            if (role == "Staff") {
                adminEmail = req.user.Email;
            }else if(role=="Admin"){
                adminEmail=email;
            }
            // 2) Validation
            const validationErrors = validate(email, password, repeatPassword, fullName);
            if (validationErrors.length != 0) {
                res.status(statusCodes[5]).send({
                    success: false,
                    errorCode: 5,
                    message: errorCodes[5],
                    errors: validationErrors
                });
                return;
            }
            password = await bcrypt.hash(password, 10);

            // 3) Check if user is already in the database
            let query = `
                SELECT COUNT(*) AS user_count
                FROM Users
                WHERE Email = "${email}";
            `;

            pool.query(query, (err, result, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(statusCodes[1]).json({
                        success: false,
                        errorCode: 1,
                        message: errorCodes[1],
                    });
                }
                const count = result[0].user_count;
                if (count > 0) {
                    return res.status(statusCodes[6]).json({
                        success: false,
                        errorCode: 6,
                        message: errorCodes[6]
                    });
                }
                // 4) Storing to MySQL
                query = `
                    INSERT INTO Users (FullName, Email, phone, Password, Role, CreatedOn, AdminEmail)
                    VALUES ('${fullName}', '${email}', '${phone}', '${password}', '${role}', NOW(),"${adminEmail}")
                `;

                pool.query(query, (err, result, fields) => {
                    if (err) {
                        return res.status(statusCodes[1]).json({
                            success: false,
                            errorCode: 1,
                            message: errorCodes[1],
                        });
                    }
                    // 5) Send OTP
                    mailController.sendOTP(email);
                    res.json({
                        success: true
                    });
                });
            });
        } catch (error) {
            return res.json.status(statusCodes[3])({
                success: false,
                errorCode: 3,
                message: errorCodes[3]
            });
        }
    },



    async verifyOTP(req, res, next) {
        try {
            const email = req.body.email;
            const otp = req.body.otp;
            if (!email || !otp) {
                return res.status(statusCodes[2]).json({
                    success: false,
                    errorCode: 2,
                    message: errorCodes[2]
                })
            }
            const query = `
                select * from Users where Email= "${req.body.email}"
            `;
            pool.query(query, async (err, result, fields) => {
                if (err) {
                    return res.status(statusCodes[1]).json({
                        success: false,
                        erroCode: 1,
                        message: errorCodes[1]
                    });
                }
                // console.log(result);
                if (result.length == 0) {
                    res.status(statusCodes[7]).json({
                        success: false,
                        erroCode: 7,
                        message: errorCodes[7]
                    });
                    return res.end();
                }
                const otp = result[0].OTP;
                print("RESULT FOR USER:");
                print(result[0]);
                const userRole = result[0]["Role"];
                const email = req.body.email;
                if (otp == req.body.otp) {
                    const token = jwt.sign({ email }, process.env.JWTSECRETKEY, { expiresIn: "300h" });
                    const query = `
                    UPDATE Users
                    SET IsVerified=1,jwt_token="${token}"
                    WHERE Email="${req.body.email}";
                `;
                    pool.query(query, (err, result, fields) => {
                        if (err) {
                            return res.status(statusCodes[1]).json({
                                success: false,
                                erroCode: 1,
                                message: errorCodes[1]
                            });
                        }
                        // console.log("Sending rol");
                        print("Sending ROle as");
                        print(userRole);
                        return res.status(200).json({
                            success: true,
                            jwt_token: token,
                            role: userRole
                        })
                    });

                } else {
                    res.json({
                        success: false,
                        errorCode: 8,
                        message: errorCodes[8]
                    });
                }

            });
        } catch (error) {
            return res.json.status(statusCodes[3])({
                success: false,
                errorCode: 3,
                message: errorCodes[3]
            });
        }
    },
    async authentication(req, res, next) {
        res.send(req.user);
    }
}


export default registerController;