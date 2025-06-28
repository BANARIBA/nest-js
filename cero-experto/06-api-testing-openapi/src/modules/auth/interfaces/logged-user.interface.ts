import mongoose from "mongoose";

export interface LoggedUser {
  _id: mongoose.Types.ObjectId | string,
  name: string;
  email: string;
  password: string;
  is_active: string;
  is_google: string;
  avatar: string;
}