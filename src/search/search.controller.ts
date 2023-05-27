import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchPostDto, SearchUserDto } from './dto';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Post('/users')
  searchUsers(@Body() dto: SearchUserDto) {
    return this.searchService.searchUsers(dto);
  }

  @Post('posts')
  searchPosts(@Body() dto: SearchPostDto) {
    return this.searchService.searchPosts(dto);
  }
}
