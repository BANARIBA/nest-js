import { ApiProperty } from "@nestjs/swagger";
import { User } from "../schemas/user.schema";

export class UserLoggedDto {
  @ApiProperty({
    description: 'User created or logged',
    example: {
      "user": {
        "_id": "6736d71ffa2c6431808c8036",
        "name": "Test One",
        "email": "testOne@gmail.com",
        "is_active": true,
        "is_google": false,
        "avatar": "",
        "createdAt": "2024-11-15T05:07:43.723Z",
        "updatedAt": "2024-11-15T05:07:43.723Z"
      }
    }
  })
  public readonly user: User;

  @ApiProperty({
    description: 'Token from logged user',
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzZkNzFmZmEyYzY0MzE4MDhjODAzNiIsImVtYWlsIjoidGVzdE9uZUBnbWFpbC5jb20iLCJuYW1lIjoiVGVzdCBPbmUiLCJpYXQiOjE3MzE2NDc2NjgsImV4cCI6MTczMTY1NDg2OH0.05mIbHyBlIXegc6ftqYvjmfLkDbO8DGxnQrAL_iSROg",
  })
  public readonly token: string;
}