import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const post = await this.prisma.blogPost.create({
        data: {
          ...createPostDto,
          images: createPostDto.images || [],
          publishedAt:
            createPostDto.status === 'published' ? new Date() : null,
        },
        include: {
          category: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      this.logger.log(`Created blog post: ${post.title} (${post.id})`);
      return post;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Post with this slug already exists');
      }
      throw error;
    }
  }

  async findAll(query: FindAllPostsDto) {
    const { page, limit, categoryId, cityId, search, status, sortBy } = query;

    const where: Prisma.BlogPostWhereInput = {
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(cityId && { cityId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    let orderBy: Prisma.BlogPostOrderByWithRelationInput = {
      createdAt: 'desc',
    };

    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'popular':
        orderBy = { viewCount: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const skip = ((page ?? 1) - 1) * (limit ?? 20);

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    const currentPage = page ?? 1;
    const currentLimit = limit ?? 20;
    const totalPages = Math.ceil(total / currentLimit);

    return {
      data: posts,
      meta: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  }

  async findOne(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
        city: true,
        comments: {
          where: { isApproved: true, parentId: null },
          orderBy: { createdAt: 'desc' },
          include: {
            replies: {
              where: { isApproved: true },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        _count: {
          select: {
            comments: {
              where: { isApproved: true },
            },
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with slug "${slug}" not found`);
    }

    // Increment view count
    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  }

  async findById(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
        city: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with id "${id}" not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const existingPost = await this.prisma.blogPost.findUnique({
        where: { id },
        select: { publishedAt: true },
      });

      const post = await this.prisma.blogPost.update({
        where: { id },
        data: {
          ...updatePostDto,
          ...(updatePostDto.status === 'published' &&
            !existingPost?.publishedAt && { publishedAt: new Date() }),
        },
        include: {
          category: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      this.logger.log(`Updated blog post: ${post.title} (${post.id})`);
      return post;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Blog post with ID "${id}" not found`);
      }
      if (error.code === 'P2002') {
        throw new BadRequestException('Post with this slug already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.blogPost.delete({
        where: { id },
      });

      this.logger.log(`Deleted blog post: ${id}`);
      return { message: 'Blog post deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Blog post with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async getFeatured(limit: number = 5) {
    return this.prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { viewCount: 'desc' },
      take: limit,
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: {
              where: { isApproved: true },
            },
          },
        },
      },
    });
  }
}
