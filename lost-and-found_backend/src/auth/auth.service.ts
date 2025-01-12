import { BadRequestException, ForbiddenException, Injectable,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/roles/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: AuthDto){
    //generate the password hash
    const passwordHash = await argon.hash(dto.password);

    //save the new user in the db
    try{
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: 'user'
      },
    })
    delete user.passwordHash //shouldnt return the hashed password 

    const token = await this.signToken(user.id, user.email,user.role)
    return {
      access_token: token.access_token,
      role: user.role
    }
  }catch(error){
      throw new BadRequestException("USER_ALREADY_EXISTS");
  }
 
  }



  async login(dto: AuthDto){
    //find the user
    console.log(dto);
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })

    //user doesnt exist
    if(!user) throw new ForbiddenException('Incorrect Credentials');

    //compare password
    const pwMatches = await argon.verify(
      user.passwordHash,
      dto.password
    );

    //incorrect password exception
    if (!pwMatches) throw new ForbiddenException('Incorrect Credentials');

    delete user.passwordHash
    const token = await this.signToken(user.id, user.email, user.role);

    return {
      access_token: token.access_token,
      role: user.role,
    };
  }

  async signToken(userId: number,email: string,role: string): Promise<{access_token: string}>{
    const payload = {
      sub: userId,
      email,
      role,
    }

    const secret = this.config.get('JWT_SECRET')

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '30m',
        secret: secret
      }
    )
    return{
      access_token: token,
    }
    
  }


  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
