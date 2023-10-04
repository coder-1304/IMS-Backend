import bcrypt from "bcryptjs";
import pool from "../../Database/connection.js";
// import auth from '../../../middlewares/auth.js'
import jwt from "jsonwebtoken";
import statusCodes from "../../constants/statusCodes.js";
import errorCodes from "../../constants/errorCodes.js";

const shopController = {
  async createShop(req, res, next) {
    try {
      if (req.user.Role != "Admin") {
        return res.status(statusCodes[12]).json({
          success: false,
          errorCode: 12,
          message: errorCodes[12],
        });
      }
    //   console.log(req.user);
      const email = req.user.Email;
      const shopName = req.body.shopName;
      const address = req.body.address;
      const city = req.body.city;
      const state = req.body.state;
      const country = req.body.country;
      const phone = req.body.phone;
      if (!shopName || !address || !city || !state || !country || !phone) {
        return res.status(statusCodes[2]).json({
          success: false,
          errorCode: 2,
          message: errorCodes[2],
        });
      }
      const query = `
                INSERT INTO Shops (ShopName, Address, City, State, Country, PhoneNumber, AdminEmail)
                VALUES('${shopName}', '${address}', '${city}', '${state}', '${country}', '${phone}', '${email}')
            `;
      pool.query(query, (err, result, fields) => {
        if (err) {
          return res.status(statusCodes[1]).json({
            success: false,
            errorCode: 1,
            message: errorCodes[1],
          });
        }
        res.json({
          success: true,
        });
        res.end();
      });
    } catch (error) {
      return res.status(statusCodes[3]).json({
        success: false,
        errorCode: 3,
        message: errorCodes[3],
      });
    }
  },
  async getShops(req, res, next) {
    try {
      const query = `
            SELECT * from Shops
            WHERE AdminEmail="${req.user.AdminEmail}"
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
          result,
        });
      });
    } catch (error) {
      return res.status(statusCodes[3]).json({
        success: false,
        errorCode: 3,
        message: errorCodes[3],
      });
    }
  },
};

export default shopController;
