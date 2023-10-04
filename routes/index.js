import express from 'express';
import registerController from '../controllers/User/registerController.js';
import loginController from '../controllers/User/loginController.js';
const router = express.Router();
import auth from '../middlewares/auth.js';
// import shopController from '../controllers/Shop/Shop.js';
import shopController from '../controllers/Shops/shop.js';
import productController from '../controllers/Product/productController.js';
import salesController from '../controllers/Sales/saleController.js';
import productEditor from '../controllers/Product/productEditor.js';

router.post('/register',auth, registerController.register);
router.post('/verifyOTP', registerController.verifyOTP);
router.post('/authentication',auth, registerController.authentication);

router.post('/createShop',auth, shopController.createShop);
router.get('/getShops',auth, shopController.getShops);

router.post('/addProduct',auth, productController.addProduct);
router.get('/getProducts/:shopId',auth, productController.getShopProducts);
router.post('/sellProduct',auth, salesController.sellProduct);
router.post('/editProduct',auth, productEditor.editProduct);

router.get('/getSalesData/:shopId',auth, salesController.getSalesData);
router.get('/getGroupedSalesData/:shopId/:days',auth, salesController.getGroupedSalesData);

router.get('/',(req,res)=>{
    res.send("Server Responded SUCCESSFULLY  ED PR IM")
});

// router.post('/register/verifyOTP',registerController.verifyOTP);

router.post('/login', loginController.login);
// router.post('/logout', loginController.logout);

router.post('/home',auth, (req,res)=>{
    // res.send(`<h1>Homepage</h1><h2>Hello ${req.user.fName}</h2>`);

    // res.send(req.user);
});

export default router;