import express from 'express';
import {APP_PORT} from './config/index.js'
const app = express();

import errorHandler from './middlewares/errorHandler.js';


import './Database/connection.js';
// require('./database/db/connection.js');
// const Learner = require('./database/models/learner.js');

app.use(express.json());
app.use(express.urlencoded());
import cookieParser from 'cookie-parser';
app.use(cookieParser());

app.use(errorHandler);

import routes from './routes/index.js'
const port = process.env.PORT || 4000
app.use('/api',routes)

app.listen(port,()=>{
    console.log('listening to server port '+port);
})