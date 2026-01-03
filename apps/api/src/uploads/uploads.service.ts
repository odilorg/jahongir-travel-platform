import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class UploadsService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');

  /**
   * Optimize and save image
   */
  async optimizeImage(
    file: Express.Multer.File,
    folder: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
    },
  ): Promise<string> {
    try {
      const { width = 1200, height, quality = 80 } = options || {};

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const extension = '.webp'; // Convert all images to WebP for better compression
      const filename = `${timestamp}-${randomString}${extension}`;
      const folderPath = path.join(this.uploadsDir, folder);
      const filepath = path.join(folderPath, filename);

      // Ensure folder exists
      await fs.mkdir(folderPath, { recursive: true });

      // Optimize image with Sharp
      let sharpInstance = sharp(file.buffer);

      if (height) {
        sharpInstance = sharpInstance.resize(width, height, { fit: 'cover' });
      } else {
        sharpInstance = sharpInstance.resize(width, null, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      await sharpInstance
        .webp({ quality })
        .toFile(filepath);

      // Return relative path for database storage
      return `${folder}/${filename}`;
    } catch (error) {
      throw new BadRequestException('Failed to process image');
    }
  }

  /**
   * Delete image file
   */
  async deleteImage(imagePath: string): Promise<void> {
    try {
      const filepath = path.join(this.uploadsDir, imagePath);
      await fs.unlink(filepath);
    } catch (error) {
      // Ignore errors if file doesn't exist
      console.error('Failed to delete image:', error);
    }
  }

  /**
   * Delete multiple images
   */
  async deleteImages(imagePaths: string[]): Promise<void> {
    await Promise.all(
      imagePaths.map((imagePath) => this.deleteImage(imagePath)),
    );
  }
}
