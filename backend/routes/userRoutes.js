import express from 'express';
import { getUserByOfficeId } from '../controllers/userController.js';

const router = express.Router();
router.get('/office/:officeId', getUserByOfficeId);

export default router;
