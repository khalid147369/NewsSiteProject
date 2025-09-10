"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const adminControler_1 = require("../controllers/adminControler");
const authmiddleware_1 = require("../middleware/authmiddleware");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post('/addPost', authmiddleware_1.verifyToken, authmiddleware_1.isAdmin, postController_1.createPost);
router.delete('/deleteById/:id', authmiddleware_1.verifyToken, authmiddleware_1.isAdmin, postController_1.deletePost);
router.delete('/deleteMany', authmiddleware_1.verifyToken, authmiddleware_1.isAdmin, postController_1.deletePosts);
router.put('/updatePost/:id', authmiddleware_1.verifyToken, authmiddleware_1.isAdmin, postController_1.updatePost); // Nueva ruta para editar post
router.post('/makeAdmin/:id', authmiddleware_1.verifyToken, authmiddleware_1.isAdmin, adminControler_1.makeAdmin);
router.get('/getUsers', authmiddleware_1.verifyToken, authmiddleware_1.isAdmin, userController_1.getUsers);
exports.default = router;
