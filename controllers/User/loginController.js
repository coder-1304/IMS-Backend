import bcrypt from 'bcryptjs';
import pool from '../../Database/connection.js';
// import auth from '../../../middlewares/auth.js'
import jwt from 'jsonwebtoken';
import errorCodes from '../../constants/errorCodes.js';
import statusCodes from '../../constants/statusCodes.js';

const loginController = {
    async login(req, res, next) {

        try {
            console.log("Logging In");
            const email = req.body.email;
            const password = req.body.password;
            if (!email || !password) {
                return res.status(statusCodes[2]).json({
                    success: false,
                    errorCode: 2,
                    message: errorCodes[2]
                });
            }
            let query = `
                SELECT * FROM Users
                WHERE Email = "${email}";
            `;

            pool.query(query, async (err, result, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(statusCodes[1]).json({
                        success: false,
                        errorCode: 1,
                        message: errorCodes[1]
                    });
                }
                if (result.length == 0) {
                    return res.status(statusCodes[7]).json({
                        success: false,
                        errorCode: 7,
                        message: errorCodes[7]
                    });
                }
                console.log(result);

                // Verify Password:
                const isMatch = await bcrypt.compare(password, result[0].Password);
                if (!isMatch) {
                    return res.status(statusCodes[14]).json({
                        success: false,
                        errorCode: 14,
                        message: errorCodes[14]
                    });
                }
                // Set token
                const token = jwt.sign({ email }, process.env.JWTSECRETKEY, { expiresIn: "300h" });
                query = `
                    UPDATE Users 
                    SET jwt_token="${token}"
                    WHERE Email="${email}"
                `;

                pool.query(query, (err, result, fields) => {
                    if (err) {
                        console.log(err);
                        return res.status(statusCodes[1]).json({
                            success: false,
                            errorCode: 1,
                            message: errorCodes[1]
                        });
                    }
                    return res.status(200).json({
                        success: true,
                        jwt_token: token
                    });
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(statusCodes[3]).json({
                success: false,
                errorCode: 3,
                message: errorCodes[3]
            });
        }
    }

}
    

export default loginController;