import { Module } from '@nestjs/common';
import { LostItemsService } from './lost-items.service';
import { LostItemsController } from './lost-items.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LostItemsController],
  providers: [LostItemsService],
  exports: [LostItemsService],
})
export class LostItemsModule {}
