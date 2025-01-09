import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ClaimModule } from './claim/claim.module';
import { LostItemsModule } from './lost-items/lost-items.module';
import { LostItemsController } from './lost-items/lost-items.controller';
import { AuthGuard } from './auth/Guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    ClaimModule,
    LostItemsModule,
  ],
  controllers: [AppController, LostItemsController],
  providers: [AppService],
})
export class AppModule {}