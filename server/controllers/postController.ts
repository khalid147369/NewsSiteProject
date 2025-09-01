import { Request, Response } from 'express';
import PostModel  from '../models/post'; // Import the Mongoose User model
import { IPost } from '../types';
import { SortOrder } from 'mongoose';

export const createPost = async (req: Request, res: Response) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const newPost = new PostModel({ title, content, author });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 15;
const direction : any  = parseInt(req.query.direction as string) || -1; // '1' or '-1'
  const skip = (page - 1) * limit;
console.log(`Fetching posts for page ${page} with limit ${limit}`);
  try {
    const posts = await PostModel.find()
      .sort({ publishedAt: direction }) // ordena por más recientes
      .skip(skip)
      .limit(limit);

    const total = await PostModel.countDocuments(); // total de posts
    const totalCategory = {
      world : await PostModel.find({category: 'world'}).countDocuments(),
      politics : await PostModel.find({category: 'politics'}).countDocuments(),
      sports : await PostModel.find({category: 'sports'}).countDocuments(),
      technology : await PostModel.find({category: 'technology'}).countDocuments(),
    }

    res.status(200).json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      totalCategory,
      direction :direction

    });
    
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
export const getAreaPosts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 15;
const direction : any  = parseInt(req.query.direction as string) || -1; // '1' or '-1'
  const skip = (page - 1) * limit;
console.log(`Fetching posts for page ${page} with limit ${limit}`);
  try {
    const posts = await PostModel.find({category: req.query.category})
      .sort({ publishedAt: direction }) // ordena por más recientes
      .skip(skip)
      .limit(limit);

    const total = await PostModel.find({category: req.query.category}).countDocuments(); // total de posts

    res.status(200).json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      direction :direction
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params; // <-- CORRECTO
  console.log(`Deleting post with ID: ${id}`);
  try {
    const post = await PostModel.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await PostModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
export const deletePosts = async (req: Request, res: Response) => {
  const { ids } = req.body; // ids debe ser un array de strings
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'No IDs provided' });
  }
  try {
    const result = await PostModel.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Posts deleted successfully', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, author } = req.body;
  try {
    const post = await PostModel.findByIdAndUpdate(id, { title, content, author }, { new: true });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// GET /api/posts/search?q=algo
export const findPost = async (req: Request, res: Response) => {
  try {
    const query = req.query.text?.toString() || "";



    const posts = await PostModel.find(
      { $text: { $search: query } },   // búsqueda en índice de texto
      { score: { $meta: "textScore" } } // incluimos relevancia
    )
      .sort({ score: { $meta: "textScore" } }) // ordenar por relevancia
      .limit(10);

    res.json(posts);
  } catch (err) {
    console.error("Error en búsqueda:", err);
    res.status(500).json({ error: "Error al buscar posts" });
  }
};

