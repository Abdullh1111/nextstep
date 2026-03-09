import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SubservicesModule } from './modules/subservices/subservices.module';
import { PackagesModule } from './modules/packages/packages.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ScholarshipsModule } from './modules/scholarships/scholarships.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { SettingsModule } from './modules/settings/settings.module';
import { InitModule } from './modules/init/init.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    SubservicesModule,
    PackagesModule,
    JobsModule,
    ScholarshipsModule,
    SubmissionsModule,
    SettingsModule,
    InitModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
