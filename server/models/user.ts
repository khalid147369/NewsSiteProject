import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  refreshtoken: string;
  roles?: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshtoken: { type: String, required: false ,default :null},
  roles: { type: String, default: 'user' } // Default role is 'user'

});

export default mongoose.model<IUser>('user', UserSchema);
