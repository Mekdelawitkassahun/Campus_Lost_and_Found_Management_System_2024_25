import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { Passport } from 'passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './strategy';



@Module({
  imports: [UserModule,Passport,PrismaModule,JwtModule.register({}) ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports: [JwtModule,AuthService]
})
export class AuthModule {}
