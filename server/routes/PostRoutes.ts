import { Router } from 'express';
import {getPostById ,getPosts, getAreaPosts,findPost   } from '../controllers/postController';

const router = Router();

router.get('/getById/:id', getPostById);
router.get('/getAll/', getPosts);
router.get('/getArea/', getAreaPosts);
router.get('/search/',findPost );


export default router;
