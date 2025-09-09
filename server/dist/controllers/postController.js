"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPost = exports.updatePost = exports.deletePosts = exports.deletePost = exports.getPostById = exports.getAreaPosts = exports.getPosts = exports.createPost = void 0;
const post_1 = __importDefault(require("../models/post")); // Import the Mongoose User model
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const newPost = new post_1.default({ title, content, author });
        yield newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.createPost = createPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const direction = parseInt(req.query.direction) || -1; // '1' or '-1'
    const skip = (page - 1) * limit;
    console.log(`Fetching posts for page ${page} with limit ${limit}`);
    try {
        const posts = yield post_1.default.find()
            .sort({ publishedAt: direction }) // ordena por más recientes
            .skip(skip)
            .limit(limit);
        const total = yield post_1.default.countDocuments(); // total de posts
        const totalCategory = {
            world: yield post_1.default.find({ category: 'world' }).countDocuments(),
            politics: yield post_1.default.find({ category: 'politics' }).countDocuments(),
            sports: yield post_1.default.find({ category: 'sports' }).countDocuments(),
            technology: yield post_1.default.find({ category: 'technology' }).countDocuments(),
        };
        res.status(200).json({
            posts,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            totalCategory,
            direction: direction
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getPosts = getPosts;
const getAreaPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const direction = parseInt(req.query.direction) || -1; // '1' or '-1'
    const skip = (page - 1) * limit;
    console.log(`Fetching posts for page ${page} with limit ${limit}`);
    try {
        const posts = yield post_1.default.find({ category: req.query.category })
            .sort({ publishedAt: direction }) // ordena por más recientes
            .skip(skip)
            .limit(limit);
        const total = yield post_1.default.find({ category: req.query.category }).countDocuments(); // total de posts
        res.status(200).json({
            posts,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            direction: direction
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getAreaPosts = getAreaPosts;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield post_1.default.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.getPostById = getPostById;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // <-- CORRECTO
    console.log(`Deleting post with ID: ${id}`);
    try {
        const post = yield post_1.default.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        yield post_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.deletePost = deletePost;
const deletePosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body; // ids debe ser un array de strings
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'No IDs provided' });
    }
    try {
        const result = yield post_1.default.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Posts deleted successfully', deletedCount: result.deletedCount });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.deletePosts = deletePosts;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, content, author } = req.body;
    try {
        const post = yield post_1.default.findByIdAndUpdate(id, { title, content, author }, { new: true });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post updated successfully', post });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.updatePost = updatePost;
// GET /api/posts/search?q=algo
const findPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = ((_a = req.query.text) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        const posts = yield post_1.default.find({ $text: { $search: query } }, // búsqueda en índice de texto
        { score: { $meta: "textScore" } } // incluimos relevancia
        )
            .sort({ score: { $meta: "textScore" } }) // ordenar por relevancia
            .limit(10);
        res.json(posts);
    }
    catch (err) {
        console.error("Error en búsqueda:", err);
        res.status(500).json({ error: "Error al buscar posts" });
    }
});
exports.findPost = findPost;
