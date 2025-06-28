import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


@Schema({timestamps: true, versionKey: false})
export class User extends Document { 

  @Prop({required: [true, 'Field name is required'], trim: true})
  name: string;

  @Prop({required: [true, 'Field email is required'], trim: true, unique: true})
  email: string;

  @Prop({required: [true, 'Field password is required'], trim: true, minlength: 6})
  password: string;

  @Prop({required: [true, 'Field is_active is required'], default: true})
  is_active: true;

  @Prop({required: [true, 'Field is_google is required'], default: false})
  is_google: boolean; 

  @Prop({default: ''})
  avatar: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
