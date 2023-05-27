import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, EditPostDto } from './dto';
import { GetUser, Roles } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { Role } from '../auth/enum';
import { RolesGuard } from '../auth/guard/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommentService } from '../comment/comment.service';
import { CommentDto } from '../comment/dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private commentService: CommentService,
  ) {}

  @Get('/feed')
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png', //todo
        })
        // .addMaxSizeValidator({ maxSize: 4000 })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  createPost(@GetUser('id') userId: number, @Body() dto: CreatePostDto) {
    return this.postService.createPost(userId, dto);
  }

  @Get()
  getPosts(@GetUser('id') userId: number) {
    return this.postService.getPosts(userId);
  }

  @Get(':id')
  getPost(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postService.getPost(userId, postId);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  updatePost(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: EditPostDto,
  ) {
    return this.postService.updatePost(userId, postId, dto);
  }

  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePost(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postService.deletePost(userId, postId);
  }

  //Comments
  @Get(':postId/comments')
  getPostComments(@Param('postId') postId: number) {
    return this.commentService.getAllPostComments(postId);
  }

  @Post(':postId/comments')
  createComment(
    @GetUser() userId: number,
    @Param('postId') postId: number,
    dto: CommentDto,
  ) {
    return this.commentService.createComment(postId, userId, dto);
  }

  @Get(':postId/comments/:commentId')
  getComment(
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
  ) {
    return this.commentService.getComment(postId, commentId);
  }

  @Patch(':postId/comments/:commentId')
  updateComment(
    @GetUser('id') userId: number,
    @Param(':postId') postId: number,
    @Param('commentId') commentId: number,
    dto: CommentDto,
  ) {
    return this.commentService.updateComment(postId, userId, commentId, dto);
  }

  @Delete(':postId/comments/:commentId')
  deleteComment(
    @GetUser('id') userId: number,
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
  ) {
    return this.commentService.deleteComment(userId, postId, commentId);
  }
}
