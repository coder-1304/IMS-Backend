import bcrypt from 'bcryptjs';
import pool from '../../Database/connection.js';
// import auth from '../../../middlewares/auth.js'
import jwt from 'jsonwebtoken';
import statusCodes from '../../constants/statusCodes.js';
import errorCodes from '../../constants/errorCodes.js';


const salesController = {
    async sellProduct(req, res, next) {
        try {
            const productID = req.body.ProductID;
            const shopID = req.body.ShopID;
            const quantity = req.body.quantity;

            if (!productID || !shopID || !quantity) {
                return res.status(statusCodes[2]).json({
                    success: false,
                    errorCode: 2,
                    message: errorCodes[2]
                });
            }
            // Check if the user has access to the Shop
            let query = `
            SELECT AdminEmail FROM Shops
            WHERE ShopID=${shopID};
        `;


            pool.query(query, (err, result, fields) => {
                if (err) {
                    return res.status(statusCodes[1]).json({
                        success: false,
                        errorCode: 1,
                        message: errorCodes[1]
                    });
                }
                console.log(result);

                //  Staff member of other shops can't modifify sales
                if (result[0].AdminEmail != req.user.AdminEmail) {
                    return res.status(statusCodes[12]).json({
                        success: false,
                        errorCode: 12,
                        message: errorCodes[12]
                    });
                }
                // Getting Product Details:
                query = `
                SELECT * FROM Products
                WHERE ProductID=${productID}
            `;
                pool.query(query, (err, result, fields) => {
                    if (err) {
                        return res.status(statusCodes[1]).json({
                            success: false,
                            errorCode: 1,
                            message: errorCodes[1]
                        });
                    }
                    if (result[0].Quantity < quantity) {
                        return res.status(statusCodes[13]).json({
                            success: false,
                            errorCode: 13,
                            message: errorCodes[13]
                        });
                    }
                    const price = result[0].Price;
                    const totalAmount = price * quantity;
                    const availableQuantity = result[0].Quantity - quantity;
                    const unitID = result[0].UnitID
                    // Updating Products
                    query = `
                    UPDATE Products
                    SET Quantity = ${availableQuantity}
                    WHERE ProductID = ${productID};
                `;

                    pool.query(query, (err, result, fields) => {
                        if (err) {
                            return res.status(statusCodes[1]).json({
                                success: false,
                                errorCode: 1,
                                message: errorCodes[1]
                            });
                        }
                        // Adding into Sales
                        query = `
                        INSERT INTO Sales (ProductID, ShopID, StaffEmail, SaleDate, SaleQuantity, UnitID, TotalAmount)
                        VALUES (${productID}, ${shopID}, '${req.user.Email}', NOW(), ${quantity}, ${unitID}, ${totalAmount})
                    `;
                        pool.query(query, (err, result, fields) => {
                            if (err) {
                                return res.status(statusCodes[1]).json({
                                    success: false,
                                    errorCode: 1,
                                    message: errorCodes[1]
                                });
                            }
                            return res.status(200).json({
                                success: true
                            });
                        });
                    });
                });
            });
        } catch (error) {
            return res.status(statusCodes[3]).json({
                success: false,
                errorCode: 3,
                message: errorCodes[3]
            });
        }
    },

    async getSalesData(req, res, next) {

    }
}

export default salesController;