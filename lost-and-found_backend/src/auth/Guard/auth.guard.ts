
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = this.jwtService.verify(token, { secret });
      request.user = { id: decoded.sub, email: decoded.email,role: decoded.role }; // Attach user information to the request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}



















// import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { Request } from 'express';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService, private configService: ConfigService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const token = request.headers['authorization'];

//     if (!token) {
//       throw new UnauthorizedException('Missing access token');
//     }

//     try {
//       const payload = await this.jwtService.verifyAsync(token, {
//         secret: this.configService.get('JWT_SECRET'),
//       });
//       // Attach user info to the request object
//       request['user'] = payload;
//     } catch (err) {
//       throw new UnauthorizedException('Invalid or expired token');
//     }

//     return true;
//   }

//   private extractTokenFromHeader(request: Request): string | null {
//     const authorization = request.headers.authorization;
//     if (!authorization || !authorization.startsWith('Bearer ')) {
//       return null;
//     }
//     return authorization.split(' ')[1]; // Extract the token part
//   }
// }
