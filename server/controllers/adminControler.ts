import { Request, Response } from 'express';
import UserModel from '../models/user';

export const makeAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }
    user.roles = 'admin'; // Cambia el rol a admin
    await user.save();
    res.status(200).json({ message: 'User role updated to admin', user: { username: user.username, email: user.email, roles: user.roles } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};