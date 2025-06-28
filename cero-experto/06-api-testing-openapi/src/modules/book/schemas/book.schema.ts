import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export enum Category {
    ADVENDTURE='ADVENDTURE',
    CLASSICS='CLASSICS',
    CRIME='CRIME',
    FANTASY='FANTASY',
}

export type UserDocument = HydratedDocument<Book>;

@Schema({ versionKey: false, timestamps: true })
export class Book {
    
    @ApiProperty({
        example: 'Clean Code Book',
        description: 'Book name',
        uniqueItems: true,
    })
    @Prop({required: [true, 'Book title is required'], trim: true, uppercase: true, unique: true})
    title: string;

    @ApiProperty({
        example: 'Book for programmers',
        description: 'Book description'
    })
    @Prop({required: [true, 'Book description is required'], trim: true, uppercase: true})
    description: string;

    @ApiProperty({
        example: 'Robert C Martin',
        description: ''
    })
    @Prop({required: [true, 'Book author is required'], trim: true, uppercase: true})
    author: string;

    @ApiProperty({
        example: 21.99,
        description: 'Book Price'
    })
    @Prop({required: [true, 'Book price is required']})
    price: number;

    @ApiProperty({
        example: 'FANTASY',
        description: 'Book Category, see the categories enum for more info'
    })
    @Prop({required: [true, 'Book category is required']})
    category: Category;

    @Prop({default: true})
    is_active: boolean;

    @Prop({required: [true, 'User creator is required'], type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: string;

}

export const BookSchema = SchemaFactory.createForClass(Book);
