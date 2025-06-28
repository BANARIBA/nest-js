import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {

  @Prop({
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
    required: [true, 'Name is required'],
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
    required: [true, 'No is required'],
  })
  no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
