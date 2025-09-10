import { Router } from 'express';
import { createPost, deletePost, updatePost ,deletePosts } from '../controllers/postController';
import { makeAdmin } from '../controllers/adminControler';
import { isAdmin ,verifyToken } from '../middleware/authmiddleware';
import { getUsers } from '../controllers/userController';

const router = Router();

router.post('/addPost',verifyToken,isAdmin, createPost);
router.delete('/deleteById/:id',verifyToken,isAdmin,deletePost );
router.delete('/deleteMany',verifyToken,isAdmin,deletePosts );
router.put('/updatePost/:id',verifyToken,isAdmin, updatePost); // Nueva ruta para editar post
router.post('/makeAdmin/:id',verifyToken,isAdmin, makeAdmin);
router.get('/getUsers',verifyToken,isAdmin, getUsers);

export default router;