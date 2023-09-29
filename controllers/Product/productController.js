import bcrypt from 'bcryptjs';
import pool from '../../Database/connection.js';
// import auth from '../../../middlewares/auth.js'
import jwt from 'jsonwebtoken';
import errorCodes from '../../constants/errorCodes.js';
import statusCodes from '../../constants/statusCodes.js';

const productController = {
    async addProduct(req, res, next) {
        try {
            // Only Admins can add products
            if (req.user.Role != "Admin") {
                return res.status(statusCodes[12]).json({
                    success: false,
                    errorCode: 12,
                    message: errorCodes[12]  // 403 unauthorized 
                })
            }
            const email = req.user.Email;
            const productName = req.body.productName;
            const description = req.body.description;
            const price = req.body.price;
            const unitId = req.body.unitId;
            const shopID = req.body.shopID;
            const quantity = req.body.quantity;

            // All fields must be non-empty
            if (!productName || !description || !price || !unitId || !shopID || !quantity) {
                return res.status(statusCodes[2]).json({
                    success: false,
                    errorCode: 2,
                    message: errorCodes[2]
                });
            }

            // Only Shop's Admin can add product to the shop
            let query = `
                SELECT AdminEmail from Shops
                WHERE ShopID=${shopID}
            `;
            pool.query(query, (err, result, fields) => {
                if (err) {
                    return res.status(statusCodes[1]).json({
                        success: false,
                        errorCode: 1,
                        message: errorCodes[1]
                    });
                }
                else if (result[0].AdminEmail != req.user.Email) {
                    // Unauthorized access 403
                    return res.status(statusCodes[12]).json({
                        success: false,
                        errorCode: 12,
                        message: errorCodes[12]
                    })
                }
                // Adding Product to database
                query = `
                    INSERT INTO Products (ProductName, Description, Price,quantity, UnitID, ShopID, AddedOn)
                    VALUES('${productName}', '${description}', ${price},${quantity}, '${unitId}', '${shopID}', NOW())
                `;
                pool.query(query, (err, result, fields) => {
                    if (err) {
                        return res.status(statusCodes[1]).json({
                            success: false,
                            errorCode: 1,
                            message: errorCodes[1],
                        });
                    }
                    return res.status(200).json({
                        success: true
                    });
                });
            });
        } catch (err) {
            return res.status(statusCodes[3]).json({
                success: false,
                errorCode: 3,
                message: errorCodes[3]
            });
        }
    },
    async getShopProducts(req, res, next) {
        try {
            const shopId = req.body.shopId;
            if (!shopId) {
                return res.status(statusCodes[2]).json({
                    success: false,
                    errorCode: 2,
                    message: errorCodes[2]
                })
            }
            query = `
                SELECT * FROM Products 
                WHERE ShopID=${shopId}
            `;
            pool.query(query, (err, result, fields) => {
                if (err) {
                    return res.status(statusCodes[1]).json({
                        success: false,
                        errorCode: 1,
                        message: errorCodes[1],
                    });
                }
                return res.status(200).json({
                    success: true,
                    result
                });
            });


        } catch (error) {
            return res.status(statusCodes[3]).json({
                success: false,
                errorCode: 3,
                message: errorCodes[3]
            });
        }
    }
}

export default productController;