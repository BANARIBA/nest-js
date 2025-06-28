import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import { Model } from 'mongoose';
import { SearchBookByDto } from './dto';
import { SearchBook } from './interfaces';
import { environmentVariables, verifyObjectiD } from 'src/core/config';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class BookService {

  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<Book>
  ) { }

  async create(createBookDto: CreateBookDto, user: User): Promise<Book> {
    try {
      const newBook = await this.bookModel.create({...createBookDto, user: user});
      return await newBook.save();
    } catch (error) {
      if (error.code = 11000) throw new BadRequestException('Duplicated record');
      throw new InternalServerErrorException(`Sometime went wrong creating the book: ${error}`);
    }
  }

  async findAll(searchBookByDto: SearchBookByDto): Promise<{ totalRecords: number, data: Book[] }> {
    try {
      const {limit = environmentVariables.defaultLimit, skip = environmentVariables.defaultSkip} = searchBookByDto;
      let searchBook: SearchBook = {};
      if (searchBookByDto.title) {
        searchBook.title = { $regex: searchBookByDto.title, $options: 'i' };
      }
      if (searchBookByDto.description) {
        searchBook.description = { $regex: searchBookByDto.description, $options: 'i' };
      }
      if (searchBookByDto.is_active) {
        searchBook.is_active = (searchBookByDto.is_active === 'true') ? true : false;
      }
      // console.log(searchBook)
      const [data, totalRecords] = await Promise.all([
        this.bookModel.find(searchBook).populate('user', 'name').limit(limit).skip(limit * skip),
        this.bookModel.countDocuments(searchBook),
      ]);

      if (data.length === 0 && totalRecords === 0) throw new NotFoundException('Data not found');

      return {
        totalRecords: totalRecords,
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Sometime went wrong: ${error}`);
    }
  }

  async findOne(id: string): Promise<Book> {
    try {
      if (!verifyObjectiD(id)) throw new BadRequestException(`The book id is not valid`);
      const book = await this.bookModel.findOne({ _id: id }).populate('user', 'name');
      if (!book) throw new NotFoundException(`Book ${id} not found`);
      return book;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Sometime went wrong: ${error}`);
    }
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    try {
      if (!verifyObjectiD(id)) throw new BadRequestException(`The book id is not valid`);
      const updatedBook = await this.bookModel.findOneAndUpdate({ _id: id }, { ...updateBookDto }, { new: true });
      return updatedBook;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code = 11000) throw new BadRequestException('Duplicated record');
      throw new InternalServerErrorException(`Sometime went wrong: ${error}`);
    }
  }

  async remove(id: string): Promise<Book> {
    try {
      if (!verifyObjectiD(id)) throw new BadRequestException(`The book id is not valid`);
      await this.findOne(id);
      const updatedBook = await this.bookModel.findOneAndUpdate({_id: id}, {is_active: false}, {const : true});
      return updatedBook;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Sometime went wrong: ${error}`);
    }
  }
}

