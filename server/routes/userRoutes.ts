import { Router } from 'express';
import { register, login  ,logout,editProfile, editProfilePassword } from '../controllers/userController';
import {refreshToken}  from '../refreshtoken';
import { verifyToken } from '../middleware/authmiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refreshtoken', refreshToken);
router.post('/logout', logout);
router.patch('/editProfile',verifyToken, editProfile);
router.patch('/editProfilePassword',verifyToken, editProfilePassword);

export default router;
