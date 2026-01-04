import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { Locale } from '../i18n/locale.decorator';
import { Locale as LocaleType } from '@prisma/client';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostDto: CreatePostDto) {
    return this.blogService.create(createPostDto);
  }

  @Get()
  findAll(@Query() query: FindAllPostsDto, @Locale() locale: LocaleType) {
    return this.blogService.findAll(query, locale);
  }

  @Get('featured')
  getFeatured(@Query('limit') limit?: string, @Locale() locale?: LocaleType) {
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    return this.blogService.getFeatured(parsedLimit, locale);
  }

  @Get('id/:id')
  findById(@Param('id') id: string) {
    return this.blogService.findById(id);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Locale() locale: LocaleType) {
    return this.blogService.findOne(slug, locale);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.blogService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
