import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  /**
   * Upload single image
   */
  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
    @Body('width') width?: string,
    @Body('height') height?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!folder) {
      throw new BadRequestException('Folder is required');
    }

    const imagePath = await this.uploadsService.optimizeImage(file, folder, {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
    });

    return {
      url: `/uploads/${imagePath}`,
      path: imagePath,
    };
  }

  /**
   * Upload multiple images
   */
  @Post('images')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max per file
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder: string,
    @Body('width') width?: string,
    @Body('height') height?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    if (!folder) {
      throw new BadRequestException('Folder is required');
    }

    const uploadPromises = files.map((file) =>
      this.uploadsService.optimizeImage(file, folder, {
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
      }),
    );

    const imagePaths = await Promise.all(uploadPromises);

    return {
      urls: imagePaths.map((path) => `/uploads/${path}`),
      paths: imagePaths,
    };
  }

  /**
   * Delete image
   */
  @Delete('image')
  async deleteImage(@Body('path') path: string) {
    if (!path) {
      throw new BadRequestException('Path is required');
    }

    await this.uploadsService.deleteImage(path);

    return {
      message: 'Image deleted successfully',
    };
  }
}
