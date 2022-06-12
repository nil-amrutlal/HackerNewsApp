/** Required External Modules */

import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from './routes/stories';
import * as dotenv from "dotenv";
import path from 'path';
import cors from "cors";
import helmet from "helmet";

const router: Express = express();

router.use(morgan('dev'));
router.use(express.urlencoded({extended:false}));
router.use(express.json());

dotenv.config();
dotenv.config({ path: path.join(__dirname, 'config/.env') })



/** RULES OF OUR API */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});


/** Config */
dotenv.config({ path: path.join(__dirname, 'config/.env') })

/** Routes */
router.use('/', routes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: number = parseInt(process.env.PORT as string) ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));