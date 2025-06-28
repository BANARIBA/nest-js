import { ApiProperty } from "@nestjs/swagger";
import { Book } from "../schemas/book.schema";

export class BooksResponseDto {

  @ApiProperty({
    description: 'Books found',
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
  public readonly data: Book[];

  @ApiProperty({
    description: 'The quantity of books found',
    example: 2
  })
  public readonly totalRecords: number;
}