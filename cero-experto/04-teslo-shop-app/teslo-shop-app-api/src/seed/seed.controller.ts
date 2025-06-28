import { Controller, Get} from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Seeds')
@Controller('seeds')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get("products")
  @ApiResponse({status: 200, description: 'Products and Users seed executed successfully'})
  @ApiResponse({status: 500, description: 'Sometime went wrong executing the seed'})
  // @Auth()
  runProductsSeed (
    // @GetUser() user: User,
  ) {
    return this.seedService.runProductSeed();
  }
}
