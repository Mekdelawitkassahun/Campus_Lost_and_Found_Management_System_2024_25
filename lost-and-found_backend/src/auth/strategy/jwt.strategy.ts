import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  
  async validate(payload: {
    sub: number,
    email: string
  }){
    const user: User = await this.prisma.user.findUnique({
      where: {
        id: payload.sub
      },
      select: {id: true, email: true, role:true}
    })

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    return user;
  }



  // async validate(payload: {sub: number, email:string} ) {
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       id: payload.sub
  //     }
  //   });
  //   delete user.passwordHash;
  //   return null
  // }
}
