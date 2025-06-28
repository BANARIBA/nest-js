import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';

import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { GetUser } from '../auth/decorators/get-uset.decorator';
import { BooksResponseDto, CreateBookDto, SearchBookByDto, UpdateBookDto } from './dto';
import { User } from '../auth/schemas/user.schema';


@ApiTags('Books Endpoints')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post('')
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: 201,
    description: 'Book Created',
    type: Book
  })
  @ApiResponse({ status: 400, description: 'Sometime went wrong, duplicate book' })
  @ApiResponse({ status: 500, description: 'Sometime went wrong creating book' })
  create(
    @Body() createBookDto: CreateBookDto,
    @GetUser() user: User,
  ) {
    return this.bookService.create(createBookDto, user);
  }

  @Get('')
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: 200,
    description: 'Return products by filters',
    type: BooksResponseDto,
    example: [{
      "totalRecords": 2,
      "data": [
        {
          "_id": "67366034fe7d49225a556019",
          "title": "CLEAN CODE BOOK",
          "description": "FOR SOFTWARE ENGINNERS",
          "author": "ROBERT C. MARTIN",
          "price": 15.99,
          "category": "CRIME",
          "is_active": true,
          "createdAt": "2024-11-14T20:40:20.672Z",
          "updatedAt": "2024-11-14T20:40:20.672Z"
        },
        {
          "_id": "673661a6fe7d49225a55601e",
          "title": "CLEAN CODE WITH REFACTORING GURU",
          "description": "FOR SOFTWARE ENGINNERS",
          "author": "ALEXANDER SHVETS",
          "price": 10.99,
          "category": "CRIME",
          "is_active": true,
          "createdAt": "2024-11-14T20:46:30.226Z",
          "updatedAt": "2024-11-14T20:46:30.226Z"
        }
      ]
    }]
  })
  findAll(
    @Query() searchBookByDto: SearchBookByDto,
  ) {
    return this.bookService.findAll(searchBookByDto);
  }

  @Get(':book_id')
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: 200,
    description: 'Product found',
    example: {
      "_id": "673661a6fe7d49225a55601e",
      "title": "CLEAN CODE WITH REFACTORING GURU",
      "description": "FOR SOFTWARE ENGINNERS",
      "author": "ALEXANDER SHVETS",
      "price": 10.99,
      "category": "CRIME",
      "is_active": true,
      "createdAt": "2024-11-14T20:46:30.226Z",
      "updatedAt": "2024-11-14T20:46:30.226Z"
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product was not Found',
  })
  findOne(@Param('book_id') book_id: string) {
    return this.bookService.findOne(book_id);
  }

  @Patch(':book_id')
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: 200,
    description: 'Book Updated',
    type: Book
  })
  @ApiResponse({ status: 400, description: 'Sometime went wrong, duplicate book' })
  @ApiResponse({ status: 500, description: 'Sometime went wrong updating book' })
  update(@Param('book_id') book_id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(book_id, updateBookDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Product deleted changing the is_active field in false',
    example: {
      "_id": "673661a6fe7d49225a55601e",
      "title": "CLEAN CODE WITH REFACTORING GURU",
      "description": "FOR SOFTWARE ENGINNERS",
      "author": "ALEXANDER SHVETS",
      "price": 10.99,
      "category": "CRIME",
      "is_active": false,
      "createdAt": "2024-11-14T20:46:30.226Z",
      "updatedAt": "2024-11-14T20:46:30.226Z"
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product was not Found',
  })
  @Delete(':book_id')
  @UseGuards(AuthGuard())
  remove(@Param('book_id') book_id: string) {
    return this.bookService.remove(book_id);
  }
}
