import dotenv from 'dotenv'
// const dotenv = require('dotenv')

dotenv.config();
export const{
    APP_PORT,
    DEBUG_MODE,
    SECRET_KEY
} = process.env

// export { default as config } from './index.js';



// dotenv.config();
// module.exports = {
//   APP_PORT: process.env.APP_PORT,
//   DEBUG_MODE: process.env.DEBUG_MODE
// };