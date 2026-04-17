import express from 'express';
import { getAppStats } from '../controller/stats.controller.js';

export const statsRouter = express.Router();

// Public route to get global platform statistics
statsRouter.get('/api/stats', getAppStats);

export default statsRouter;
