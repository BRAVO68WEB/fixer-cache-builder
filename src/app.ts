import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import * as pkg from '../package.json';

import dotenv from 'dotenv';
dotenv.config({
	path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
});
import { apiConfig } from './config';

import router from './routes';
import { CacheClient } from './helpers/cacheDB';
import { loadFixerData } from './controllers/api';

export const app: express.Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('☄', 'Base Route', '/api');

app.use('/api', router);

app.use('/health', (req, res) => {
	return res.status(200).json({
		request_ip: req.ip,
		uptime: process.uptime(),
		hrtime: process.hrtime(),
	});
});

app.use('/', async (req, res) => {
    CacheClient.get("Last_Updated").then(resp => {
        return res.status(200).json({
            app: pkg.name,
            licence: pkg.license,
            version: pkg.version,
            author: pkg.author,
            last_updated: resp,
            base_currency: apiConfig.baseSymbol,
        });
    });
});

let port = parseInt(process.env.PORT || '');
if (isNaN(port) || port === 0) {
	port = 4000;
}

CacheClient.init();
loadFixerData();

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server Started at PORT: ${port}`);
});