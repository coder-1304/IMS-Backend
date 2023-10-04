import bcrypt from "bcryptjs";
import pool from "../../Database/connection.js";
// import auth from '../../../middlewares/auth.js'
import jwt from "jsonwebtoken";
import errorCodes from "../../constants/errorCodes.js";
import statusCodes from "../../constants/statusCodes.js";
import print from "../../constants/print.js";

const productEditor = {
  async editProduct(req, res, next) {
    print("Edit Product API CALLED");
    try {
      // Only Admins can add products
      if (req.user.Role != "Admin") {
        return res.status(statusCodes[12]).json({
          success: false,
          errorCode: 12,
          message: errorCodes[12], // 403 unauthorized
        });
      }
      print("Admin Verified");
      print(req.body);
      const email = req.user.Email;
      const productName = req.body.productName;
      const description = req.body.description;
      const price = req.body.price;
      const unitId = req.body.unitId;
      const shopId = req.body.shopId;
      const quantity = req.body.quantity;
      const productId = req.body.productId;
      if (quantity <= 0 || price <= 0) {
        return res.status(statusCodes[15]).json({
          success: false,
          errorCode: 15,
          message: statusCodes[15],
        });
      }
      if (!productName || !price || !unitId || !shopId || !quantity) {
        // All fields must be non-empty
        print("Empty Field detected");
        return res.status(statusCodes[2]).json({
          success: false,
          errorCode: 2,
          message: errorCodes[2],
        });
      }

      // Only Shop's Admin can add product to the shop
      let query = `
        SELECT AdminEmail from Shops
        WHERE ShopID=${shopId}
      `;
      pool.query(query, (err, result, fields) => {
        if (err) {
          print(err);
          return res.status(statusCodes[1]).json({
            success: false,
            errorCode: 1,
            message: errorCodes[1],
          });
        } else if (result[0].AdminEmail != req.user.Email) {
          // Unauthorized access 403
          print("Unauthorized");
          return res.status(statusCodes[12]).json({
            success: false,
            errorCode: 12,
            message: errorCodes[12],
          });
        }
        print("Adding product");
        // Adding Product to database
        query = `
            UPDATE Products SET 
            ProductName="${productName}",
            Description="${description}",
            Price=${price},
            UnitId=${unitId},
            ShopID=${shopId},
            Quantity=${quantity}
            WHERE ProductID=${productId};
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
          return res.status(200).json({
            success: true,
          });
        });
      });
    } catch (err) {
      console.log(err);
      return res.status(statusCodes[3]).json({
        success: false,
        errorCode: 3,
        message: errorCodes[3],
      });
    }
  },
};

export default productEditor;
