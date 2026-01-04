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
import { Prisma, Locale } from '@prisma/client';
import {
  getTranslationWithFallback,
  logMissingTranslation,
  DEFAULT_LOCALE,
} from '../i18n';

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
          translations: true,
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

      const firstTranslation = post.translations[0];
      this.logger.log(`Created blog post: ${firstTranslation?.title || post.id} (${post.id})`);
      return post;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Post with this slug already exists');
      }
      throw error;
    }
  }

  async findAll(query: FindAllPostsDto, locale: Locale = DEFAULT_LOCALE) {
    const { page = 1, limit = 20, categoryId, cityId, search, status, sortBy } = query;

    const where: Prisma.BlogPostWhereInput = {
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(cityId && { cityId }),
      ...(search && {
        translations: {
          some: {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
              { excerpt: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
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
          translations: {
            where: {
              locale: {
                in: [locale, DEFAULT_LOCALE],
              },
            },
          },
          category: {
            include: {
              translations: {
                where: {
                  locale: {
                    in: [locale, DEFAULT_LOCALE],
                  },
                },
              },
            },
          },
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

    // Flatten translations into post objects
    const data = posts.map((post) => {
      const translation = getTranslationWithFallback(post.translations, locale);
      const categoryTranslation = post.category
        ? getTranslationWithFallback(post.category.translations, locale)
        : null;

      if (!translation) {
        logMissingTranslation(
          'BlogPost',
          post.id,
          locale,
          post.translations.map((t) => t.locale),
        );
      }

      return {
        id: post.id,
        featuredImage: post.featuredImage,
        images: post.images,
        status: post.status,
        viewCount: post.viewCount,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        // Flattened translation fields
        title: translation?.title || '',
        slug: translation?.slug || '',
        excerpt: translation?.excerpt || '',
        content: translation?.content || '',
        metaTitle: translation?.metaTitle || null,
        metaDescription: translation?.metaDescription || null,
        // Category with flattened translation
        category: post.category
          ? {
              id: post.category.id,
              name: categoryTranslation?.name || '',
              slug: categoryTranslation?.slug || '',
              description: categoryTranslation?.description || null,
            }
          : null,
        author: post.author,
        _count: post._count,
      };
    });

    return {
      data,
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

  async findOne(slug: string, locale: Locale = DEFAULT_LOCALE) {
    // First find post by localized slug
    const postTranslation = await this.prisma.blogPostTranslation.findFirst({
      where: { slug },
      include: {
        post: {
          include: {
            translations: {
              where: {
                locale: {
                  in: [locale, DEFAULT_LOCALE],
                },
              },
            },
            category: {
              include: {
                translations: {
                  where: {
                    locale: {
                      in: [locale, DEFAULT_LOCALE],
                    },
                  },
                },
              },
            },
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
        },
      },
    });

    if (!postTranslation?.post) {
      throw new NotFoundException(`Blog post with slug "${slug}" not found`);
    }

    const post = postTranslation.post;
    const translation = getTranslationWithFallback(post.translations, locale);
    const categoryTranslation = post.category
      ? getTranslationWithFallback(post.category.translations, locale)
      : null;

    if (!translation) {
      logMissingTranslation(
        'BlogPost',
        post.id,
        locale,
        post.translations.map((t) => t.locale),
      );
    }

    // Increment view count
    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return {
      id: post.id,
      featuredImage: post.featuredImage,
      images: post.images,
      status: post.status,
      viewCount: post.viewCount,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      // Flattened translation fields
      title: translation?.title || '',
      slug: translation?.slug || '',
      excerpt: translation?.excerpt || '',
      content: translation?.content || '',
      metaTitle: translation?.metaTitle || null,
      metaDescription: translation?.metaDescription || null,
      // Category with flattened translation
      category: post.category
        ? {
            id: post.category.id,
            name: categoryTranslation?.name || '',
            slug: categoryTranslation?.slug || '',
            description: categoryTranslation?.description || null,
          }
        : null,
      author: post.author,
      city: post.city,
      comments: post.comments,
      _count: post._count,
    };
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
      const existingPost = await this.prisma.blogPost.findUnique({ where: { id } });
      const shouldSetPublishedAt = updatePostDto.status === 'published' && !existingPost?.publishedAt;

      const post = await this.prisma.blogPost.update({
        where: { id },
        data: {
          ...updatePostDto,
          ...(shouldSetPublishedAt && { publishedAt: new Date() }),
        },
        include: {
          translations: true,
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

      const firstTranslation = post.translations[0];
      this.logger.log(`Updated blog post: ${firstTranslation?.title || post.id} (${post.id})`);
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

  async getFeatured(limit: number = 5, locale: Locale = DEFAULT_LOCALE) {
    const posts = await this.prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { viewCount: 'desc' },
      take: limit,
      include: {
        translations: {
          where: {
            locale: {
              in: [locale, DEFAULT_LOCALE],
            },
          },
        },
        category: {
          include: {
            translations: {
              where: {
                locale: {
                  in: [locale, DEFAULT_LOCALE],
                },
              },
            },
          },
        },
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

    // Flatten translations
    return posts.map((post) => {
      const translation = getTranslationWithFallback(post.translations, locale);
      const categoryTranslation = post.category
        ? getTranslationWithFallback(post.category.translations, locale)
        : null;

      if (!translation) {
        logMissingTranslation(
          'BlogPost',
          post.id,
          locale,
          post.translations.map((t) => t.locale),
        );
      }

      return {
        id: post.id,
        featuredImage: post.featuredImage,
        images: post.images,
        status: post.status,
        viewCount: post.viewCount,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        // Flattened translation fields
        title: translation?.title || '',
        slug: translation?.slug || '',
        excerpt: translation?.excerpt || '',
        content: translation?.content || '',
        metaTitle: translation?.metaTitle || null,
        metaDescription: translation?.metaDescription || null,
        // Category with flattened translation
        category: post.category
          ? {
              id: post.category.id,
              name: categoryTranslation?.name || '',
              slug: categoryTranslation?.slug || '',
              description: categoryTranslation?.description || null,
            }
          : null,
        author: post.author,
        _count: post._count,
      };
    });
  }
}
