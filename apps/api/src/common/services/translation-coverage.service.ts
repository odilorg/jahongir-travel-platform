import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Locale } from '@prisma/client';

export interface EntityCoverage {
  entity: string;
  total: number;
  en: number;
  ru: number;
  uz: number;
  enPercent: number;
  ruPercent: number;
  uzPercent: number;
}

export interface TranslationCoverageReport {
  timestamp: Date;
  entities: EntityCoverage[];
  summary: {
    totalEntities: number;
    avgENPercent: number;
    avgRUPercent: number;
    avgUZPercent: number;
  };
}

@Injectable()
export class TranslationCoverageService implements OnModuleInit {
  private readonly logger = new Logger(TranslationCoverageService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Run coverage check on startup
    const report = await this.generateCoverageReport();
    this.logCoverageReport(report);

    // Warn if any entity has low coverage
    this.checkAndWarnLowCoverage(report);
  }

  async generateCoverageReport(): Promise<TranslationCoverageReport> {
    const entities: EntityCoverage[] = [];

    // Check Tours
    entities.push(await this.checkEntityCoverage(
      'Tour',
      async () => this.prisma.tour.count(),
      async (locale) => this.prisma.tourTranslation.count({ where: { locale } })
    ));

    // Check Tour Categories
    entities.push(await this.checkEntityCoverage(
      'TourCategory',
      async () => this.prisma.tourCategory.count(),
      async (locale) => this.prisma.tourCategoryTranslation.count({ where: { locale } })
    ));

    // Check Tour FAQs
    entities.push(await this.checkEntityCoverage(
      'TourFaq',
      async () => this.prisma.tourFaq.count(),
      async (locale) => this.prisma.tourFaqTranslation.count({ where: { locale } })
    ));

    // Check Itinerary Items
    entities.push(await this.checkEntityCoverage(
      'ItineraryItem',
      async () => this.prisma.itineraryItem.count(),
      async (locale) => this.prisma.itineraryItemTranslation.count({ where: { locale } })
    ));

    // Check Cities
    entities.push(await this.checkEntityCoverage(
      'City',
      async () => this.prisma.city.count(),
      async (locale) => this.prisma.cityTranslation.count({ where: { locale } })
    ));

    // Check Blog Posts
    entities.push(await this.checkEntityCoverage(
      'BlogPost',
      async () => this.prisma.blogPost.count(),
      async (locale) => this.prisma.blogPostTranslation.count({ where: { locale } })
    ));

    // Check Blog Categories
    entities.push(await this.checkEntityCoverage(
      'BlogCategory',
      async () => this.prisma.blogCategory.count(),
      async (locale) => this.prisma.blogCategoryTranslation.count({ where: { locale } })
    ));

    // Calculate summary
    const totalEntities = entities.length;
    const avgENPercent = entities.reduce((sum, e) => sum + e.enPercent, 0) / totalEntities;
    const avgRUPercent = entities.reduce((sum, e) => sum + e.ruPercent, 0) / totalEntities;
    const avgUZPercent = entities.reduce((sum, e) => sum + e.uzPercent, 0) / totalEntities;

    return {
      timestamp: new Date(),
      entities,
      summary: {
        totalEntities,
        avgENPercent: Math.round(avgENPercent * 10) / 10,
        avgRUPercent: Math.round(avgRUPercent * 10) / 10,
        avgUZPercent: Math.round(avgUZPercent * 10) / 10,
      },
    };
  }

  private async checkEntityCoverage(
    entityName: string,
    countTotal: () => Promise<number>,
    countTranslations: (locale: Locale) => Promise<number>
  ): Promise<EntityCoverage> {
    const total = await countTotal();

    if (total === 0) {
      return {
        entity: entityName,
        total: 0,
        en: 0,
        ru: 0,
        uz: 0,
        enPercent: 0,
        ruPercent: 0,
        uzPercent: 0,
      };
    }

    const en = await countTranslations(Locale.en);
    const ru = await countTranslations(Locale.ru);
    const uz = await countTranslations(Locale.uz);

    return {
      entity: entityName,
      total,
      en,
      ru,
      uz,
      enPercent: Math.round((en / total) * 100 * 10) / 10,
      ruPercent: Math.round((ru / total) * 100 * 10) / 10,
      uzPercent: Math.round((uz / total) * 100 * 10) / 10,
    };
  }

  private logCoverageReport(report: TranslationCoverageReport) {
    this.logger.log('='.repeat(70));
    this.logger.log('📊 TRANSLATION COVERAGE REPORT');
    this.logger.log('='.repeat(70));
    this.logger.log('');

    const header =
      'Entity'.padEnd(20) +
      'Total'.padEnd(8) +
      'EN'.padEnd(10) +
      'RU'.padEnd(10) +
      'UZ'.padEnd(10);

    this.logger.log(header);
    this.logger.log('-'.repeat(70));

    for (const entity of report.entities) {
      const row =
        entity.entity.padEnd(20) +
        entity.total.toString().padEnd(8) +
        `${entity.en} (${entity.enPercent}%)`.padEnd(10) +
        `${entity.ru} (${entity.ruPercent}%)`.padEnd(10) +
        `${entity.uz} (${entity.uzPercent}%)`.padEnd(10);

      this.logger.log(row);
    }

    this.logger.log('-'.repeat(70));
    this.logger.log(
      'AVERAGE'.padEnd(28) +
      `${report.summary.avgENPercent}%`.padEnd(10) +
      `${report.summary.avgRUPercent}%`.padEnd(10) +
      `${report.summary.avgUZPercent}%`.padEnd(10)
    );
    this.logger.log('');
    this.logger.log('='.repeat(70));
  }

  private checkAndWarnLowCoverage(report: TranslationCoverageReport) {
    const warnings: string[] = [];

    // Check for entities with 0 translations
    for (const entity of report.entities) {
      if (entity.total > 0) {
        if (entity.en === 0) {
          warnings.push(`⚠️  ${entity.entity}: No English translations (0/${entity.total})`);
        }
        if (entity.ru === 0) {
          warnings.push(`⚠️  ${entity.entity}: No Russian translations (0/${entity.total})`);
        }
        if (entity.uz === 0) {
          warnings.push(`⚠️  ${entity.entity}: No Uzbek translations (0/${entity.total})`);
        }
      }
    }

    // Check average coverage
    if (report.summary.avgENPercent < 50) {
      warnings.push(`⚠️  Low English coverage: ${report.summary.avgENPercent}% (recommended: 100%)`);
    }
    if (report.summary.avgRUPercent < 30) {
      warnings.push(`ℹ️  Low Russian coverage: ${report.summary.avgRUPercent}% (recommended: 80%+)`);
    }
    if (report.summary.avgUZPercent < 30) {
      warnings.push(`ℹ️  Low Uzbek coverage: ${report.summary.avgUZPercent}% (recommended: 80%+)`);
    }

    if (warnings.length > 0) {
      this.logger.warn('');
      this.logger.warn('Translation Coverage Warnings:');
      for (const warning of warnings) {
        this.logger.warn(warning);
      }
      this.logger.warn('');
      this.logger.warn('💡 Tip: Add missing translations via Admin Panel or seed scripts');
      this.logger.warn('');
    } else {
      this.logger.log('✅ Translation coverage looks good!');
      this.logger.log('');
    }
  }

  /**
   * Get coverage for a specific entity type
   */
  async getEntityCoverage(entityType: string): Promise<EntityCoverage | null> {
    const report = await this.generateCoverageReport();
    return report.entities.find(e => e.entity === entityType) || null;
  }

  /**
   * Get overall coverage summary
   */
  async getCoverageSummary() {
    const report = await this.generateCoverageReport();
    return report.summary;
  }
}
